const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Tag = require('../models/tag.model');
const tag = require('./tag.controller');
const slugify = require('slugify');
const to = require('await-to-js').default;
const mongoose = require('mongoose');
const tagController = require('./tag.controller');
const cloudinary = require('../config/cloudinary.config');

const getPosts = async (req, res, next) => {
    try {
        const filters = { ...req.query };
        const excludedFields = ['limit', 'sort', 'page', 'fields'];
        excludedFields.forEach((field) => delete filters[field]);

        let filterString = JSON.stringify(filters);
        filterString = filterString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedOperator) => `$${matchedOperator}`);
        const formattedFilters = JSON.parse(filterString);

        let postQueryObject = {};
        if (filters?.title) formattedFilters.title = { $regex: filters.title, $options: 'i' };
        if (filters?.author) formattedFilters.author = { $regex: filters.author, $options: 'i' };
        const finalQuery = { ...postQueryObject, ...formattedFilters };
        let query = Post.find(finalQuery)
            .select('-body')
            .populate({ path: 'tags', select: '_id name theme' })
            .populate({
                path: 'author',
                select: 'firstname lastname avatar username',
            });
        if (req.query.fields) {
            const selectedFields = req.query.fields.split(',').join(' ');
            query = query.select(selectedFields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;
        query.skip(skip).limit(limit);
        let posts;
        [error, posts] = await to(query.exec());
        [err, postCount] = await to(Post.find(finalQuery).countDocuments());
        if (err) {
            return res.status(200).json({
                status: 'success',
                message: 'Fetch posts error',
            });
        }
        return res.status(200).json({
            status: 'success',
            count: postCount,
            posts: posts,
        });
    } catch (error) {
        next(error);
    }
};

const getPostByTagsDiscuss = async (req, res, next) => {
    try {
        const [err, tag] = await to(
            Tag.findOne({
                name: 'discuss',
            }).populate({
                path: 'posts',
            }),
        );

        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Error fetching tag',
                error: err.message,
            });
        }

        if (!tag) {
            return res.status(404).json({
                status: 'error',
                message: 'Tag not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            posts: tag.posts || [],
        });
    } catch (error) {
        next(error);
    }
};

const uploadImage = async (req, res, next) => {
    try {
        if (!req?.file) {
            return res.status(400).json({
                status: 'error',
                message: 'Upload image fail',
            });
        }
        const { path: imageUrl } = req.file;
        if (imageUrl) {
            return res.status(200).json({
                status: 'success',
                message: 'Upload image successfully',
                imageUrl,
            });
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Upload image fail',
            });
        }
    } catch (error) {
        next(error);
    }
};
const searchPost = async (req, res, next) => {
    try {
        const { q } = req.query;
        const [err, posts] = await to(
            Post.find({ title: { $regex: q, $options: 'i' } })
                .select('title createdAt')
                .populate({
                    path: 'author',
                    select: 'firstname lastname avatar username',
                }),
        );
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Search error',
            });
        }

        return res.status(200).json({
            status: 'success',
            data: posts.map((post) => post.toObject()),
        });
    } catch (error) {
        next(error);
    }
};

const getPost = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const [err, post] = await to(
            Post.findById(pid)
                .populate({
                    path: 'tags',
                    select: 'name theme',
                })
                .populate({
                    path: 'author',
                    select: '-password -refreshToken',
                })
                .populate({
                    path: 'comments',
                    populate: [
                        {
                            path: 'author',
                            select: 'firstname lastname avatar',
                        },
                        {
                            path: 'parentId',
                            match: { parentId: null },
                            populate: {
                                path: 'author',
                                select: 'firstname lastname avatar',
                            },
                        },
                    ],
                }),
        );

        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Fetch post error',
            });
        }

        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
        }

        const comments = await Promise.all(
            post.comments.map(async (comment) => {
                const replies = await Comment.find({ parentId: comment._id });
                return { ...comment.toObject(), replyCount: replies.length };
            }),
        );

        return res.status(200).json({
            status: 'success',
            data: {
                ...post.toObject(),
                comments,
            },
        });
    } catch (error) {
        next(error);
    }
};

const createPost = async (req, res, next) => {
    try {
        if (!req?.file) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing image in the request',
            });
        }

        const { path: imageUrl } = req.file;
        const { title, body, tags } = req.body;
        const author = req.user._id;

        let postCreateErr, newPost, tagCreateErr, userFindErr, user, saveUserErr;

        [postCreateErr, newPost] = await to(
            Post.create({
                title,
                image: imageUrl,
                body,
                slug: slugify(title),
                author,
            }),
        );

        if (postCreateErr) {
            return res.status(500).json({
                status: 'error',
                message: 'Creating post failed',
            });
        }

        [tagCreateErr] = await to(tag.createTags(tags.split(','), newPost));

        if (tagCreateErr) {
            return res.status(500).json({
                status: 'error',
                message: 'Creating tag failed',
            });
        }

        [userFindErr, user] = await to(User.findById(author));

        if (userFindErr) {
            return res.status(500).json({
                status: 'error',
                message: 'Fetching user failed',
            });
        }

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found!',
            });
        }

        user.posts.push(newPost);

        [saveUserErr] = await to(user.save());

        if (saveUserErr) {
            return res.status(500).json({
                status: 'error',
                message: 'Saving user failed',
            });
        }

        return res.status(201).json({
            status: 'success',
            post: await newPost.populate({
                path: 'author',
                select: '-refreshToken -password -posts',
            }),
        });
    } catch (error) {
        next(error);
    }
};

////////////////////////////////

const updatePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { body } = req;
        const { _id: uid } = req.user;
        const imageUrl = req.file ? req.file.path : null;
        req = { ...req, body: { ...body, image: imageUrl } };

        let err, post;
        [err, post] = await to(Post.findById(postId).populate('tags'));

        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Fetching post failed',
            });
        }

        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
        }

        if (post.author.toString() !== uid.toString()) {
            return res.status(401).json({
                status: 'error',
                message: 'You are not allowed to update the post',
            });
        }

        Object.keys(req.body).forEach((key) => {
            if (key !== 'tags') post[key] = req.body[key];
        });

        if (req.body.tags) {
            [err] = await to(tagController.updateTags(JSON.parse(req.body.tags), post));

            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error updating tags',
                });
            }
        }

        [err] = await to(post.save());

        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Saving post failed',
            });
        }

        return res.status(200).json({
            status: 'success',
            post: post,
        });
    } catch (error) {
        next(error);
    }
};
////////////////////////////////
const getPostById = async (req, res, next) => {
    const { postId } = req.params;
    let post;
    try {
        post = await Post.findById(postId).populate('author').populate('comments').populate('tags');
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong with the server',
        });
    }
    if (!post) {
        return res.status(401).json({
            status: 'error',
            message: 'Could not find post for the provided ID',
        });
    }
    res.json({ post: post.toObject({ getters: true }) });
};
////////////////////////////////
const deletePost = async (req, res, next) => {
    const { postId } = req.params;
    try {
        const post = await Post.findByIdAndDelete(postId);
        if (post) {
            const publicId = post.image.match(/\/([^/]+)$/)[1].split('.')[0];
            await cloudinary.uploader.destroy(publicId);
            await Comment.deleteMany({ post: postId });
            const authorId = post.author;
            await User.findByIdAndUpdate(authorId, { $pull: { posts: postId } });
            const tagIds = post.tags || [];
            await Tag.updateMany({ _id: { $in: tagIds } }, { $pull: { posts: postId } });

            return res.status(200).json({
                status: 'success',
                message: 'Post deleted successfully',
            });
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};
////////////////////////////////
const likePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { _id: userId } = req.user;
        if (!postId || !userId) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing input',
            });
        }
        const [updateErr, updatedPost] = await to(
            Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true })
                .populate({
                    path: 'tags',
                    select: 'name theme',
                })
                .populate({
                    path: 'author',
                    select: 'firstname lastname avatar',
                })
                .populate({
                    path: 'comments',
                    populate: [
                        {
                            path: 'author',
                            select: 'firstname lastname avatar',
                        },
                        {
                            path: 'parentId',
                        },
                    ],
                }),
        );

        if (updateErr) {
            return res.status(500).json({
                status: 'error',
                message: 'Like post failed',
            });
        }

        // const authorId = updatedPost.author.toString();
        // if (authorId !== userId) {
        //     await NotificationService.likeNotification(userId, postId, authorId, next);
        // }

        return res.status(200).json({
            status: 'success',
            message: 'Like post successfully',
            post: updatedPost,
        });
    } catch (error) {
        next(error);
    }
};
////////////////////////////////
const unlikePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { _id: userId } = req.user;
        const [findError, postToUnlike] = await to(
            Post.findOne({ _id: postId, likes: userId })
                .populate({
                    path: 'tags',
                    select: 'name theme',
                })
                .populate({
                    path: 'author',
                    select: 'firstname lastname avatar',
                })
                .populate({
                    path: 'comments',
                    populate: [
                        {
                            path: 'author',
                            select: 'firstname lastname avatar',
                        },
                        {
                            path: 'parentId',
                        },
                    ],
                }),
        );

        if (findError) {
            return next(findError);
        }

        if (!postToUnlike) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
        }

        postToUnlike.likes = postToUnlike.likes.filter((likedUser) => !likedUser.equals(userId));
        await postToUnlike.save();

        // if (!postToUnlike.author.equals(userId)) {
        //     await NotificationService.removeLikeNotification(userId, postToUnlike.author, postId);
        // }

        return res.status(200).json({
            status: 'success',
            message: 'Unlike post successfully',
            post: postToUnlike,
        });
    } catch (error) {
        next(error);
    }
};
////////////////////////////////
const bookmarkPost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { _id: userId } = req.user;

        const [updateError, updatedPost] = await to(
            Post.findByIdAndUpdate(
                postId,
                {
                    $addToSet: { bookmarks: userId },
                },
                { new: true },
            )
                .populate({
                    path: 'tags',
                    select: 'name theme',
                })
                .populate({
                    path: 'author',
                    select: 'firstname lastname avatar',
                })
                .populate({
                    path: 'comments',
                    populate: [
                        {
                            path: 'author',
                            select: 'firstname lastname avatar',
                        },
                        {
                            path: 'parentId',
                        },
                    ],
                }),
        );

        if (updateError) {
            return res.status(500).json({
                status: 'error',
                message: 'Could not bookmark post',
            });
        }
        const [userUpdateError, updatedUser] = await to(
            User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: { bookmarked: postId },
                },
                { new: true },
            ),
        );

        if (userUpdateError) {
            return res.status(500).json({
                status: 'error',
                message: 'Could not update user bookmarks',
            });
        }
        if (!updatedPost) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            post: updatedPost,
        });
    } catch (error) {
        next(error);
    }
};
////////////////////////////////
const unbookmarkPost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { _id: userId } = req.user;

        const [updateError, updatedPost] = await to(
            Post.findByIdAndUpdate(
                postId,
                {
                    $pull: { bookmarks: userId },
                },
                { new: true },
            )
                .populate({
                    path: 'tags',
                    select: 'name theme',
                })
                .populate({
                    path: 'author',
                    select: 'firstname lastname avatar',
                })
                .populate({
                    path: 'comments',
                    populate: [
                        {
                            path: 'author',
                            select: 'firstname lastname avatar',
                        },
                        {
                            path: 'parentId',
                        },
                    ],
                }),
        );

        if (updateError) {
            return res.status(500).json({
                status: 'error',
                message: 'Could not unbookmark post',
            });
        }

        const [userUpdateError, updatedUser] = await to(
            User.findByIdAndUpdate(
                userId,
                {
                    $pull: { bookmarked: postId },
                },
                { new: true },
            ),
        );

        if (userUpdateError) {
            return res.status(500).json({
                status: 'error',
                message: 'Could not update user bookmarks',
            });
        }

        if (!updatedPost) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            post: updatedPost,
        });
    } catch (error) {
        next(error);
    }
};
const getBookmarkUser = async (req, res, next) => {
    try {
        const { _id: uid } = req.user;

        const [err, user] = await to(
            User.findById(uid).populate({
                path: 'bookmarked',
                select: 'title author createdAt tags',
                populate: [
                    { path: 'tags', select: 'name theme' },
                    { path: 'author', select: 'firstname lastname avatar username' },
                ],
            }),
        );

        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Something went wrong with the server',
            });
        }

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Could not find bookmark user',
            });
        }

        return res.status(200).json({ posts: user?.bookmarked || [] });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPosts,
    uploadImage,
    getPost,
    createPost,
    updatePost,
    getPostById,
    deletePost,
    unlikePost,
    likePost,
    bookmarkPost,
    unbookmarkPost,
    searchPost,
    getPostByTagsDiscuss,
    getBookmarkUser,
};
