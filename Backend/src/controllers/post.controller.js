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
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
const PostController = {
    ////////////////////////////////
    getPosts: async (req, res, next) => {
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
            const posts = await query.exec();
            const postCount = await Post.find(finalQuery).countDocuments();
            return res.status(200).json({
                status: 'success',
                count: postCount,
                posts: posts,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'fail',
                message: 'Can not get posts',
            });
        }
    },
    ////////////////////////////////
    uploadImage: async (req, res, next) => {
        try {
            const { path: imageUrl } = req.file;
            if (imageUrl) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Upload image successfully',
                    imageUrl,
                });
            } else {
                return res.status(500).json({
                    status: 'fail',
                    message: 'Upload image fail',
                });
            }
        } catch (error) {
            next(error);
        }
    },
    ////////////////////////////////
    getPost: async (req, res, next) => {
        const { pid } = req.params;
        const post = await Post.findById(pid)
            .populate({ path: 'tags', select: 'name theme' })
            .populate({
                path: 'author',
                select: 'firstname lastname avatar',
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'firstname lastname avatar',
                },
            });

        return res.status(200).json({
            status: post ? 'success' : 'fail',
            data: post ? post : 'Cannot get post',
        });
    },
    ////////////////////////////////
    createPost: async (req, res, next) => {
        try {
            const { path: imageUrl } = req.file;

            const { title, body, tags } = req.body;
            const author = req.user._id;

            if (!title || !body || !tags) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Title, body, and tags are required fields.',
                });
            }

            const [postCreateErr, newPost] = await to(
                Post.create({
                    title,
                    image: imageUrl,
                    body,
                    slug: slugify(title),
                    author,
                }),
            );
            if (postCreateErr) {
                return next(postCreateErr);
            }

            await tag.createTags(tags.split(','), newPost);
            // if (tagCreateErr) {
            //     return next(tagCreateErr);
            // }

            const [userFindErr, user] = await to(User.findById(author));
            if (userFindErr) {
                return next(userFindErr);
            }

            if (!user) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'User not found!',
                });
            }

            await user.posts.push(newPost);

            const [saveUserErr] = await to(user.save());
            if (saveUserErr) {
                return next(saveUserErr);
            }

            return res.status(200).json({
                status: 'success',
                post: await newPost.populate({
                    path: 'author',
                    select: '-refreshToken -password -posts',
                }),
            });
        } catch (error) {
            return next(error);
        }
    },
    ////////////////////////////////
    updatePost: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { body } = req;
            const { _id: uid } = req.user;
            const imageUrl = req.file ? req.file.path : null;
            req = { ...req, body: { ...body, image: imageUrl } };
            let post;
            post = await Post.findById(postId).populate('tags');

            if (post.author.toString() !== uid.toString()) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'You are not allowed to update the post',
                });
            }

            Object.keys(req.body).forEach((key) => {
                if (key !== 'tags') post[key] = req.body[key];
            });
            if (req.body.tags) {
                await tagController.updateTags(JSON.parse(req.body.tags), post);
            }
            await post.save();
            return res.status(200).json({
                status: 'success',
                post: post.toObject({ getters: true }),
            });
        } catch (err) {
            next(err);
        }
    },
    ////////////////////////////////
    getPostById: async (req, res, next) => {
        const { postId } = req.params;
        let post;
        try {
            post = await Post.findById(postId).populate('author').populate('comments').populate('tags');
        } catch (err) {
            return res.status(500).json({
                status: 'fail',
                message: 'Something went wrong with the server',
            });
        }
        if (!post) {
            return res.status(401).json({
                status: 'fail',
                message: 'Could not find post for the provided ID',
            });
        }
        res.json({ post: post.toObject({ getters: true }) });
    },
    ////////////////////////////////
    deletePost: async (req, res, next) => {
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
                    message: 'Post and associated comments deleted successfully',
                });
            } else {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Post not found',
                });
            }
        } catch (err) {
            return res.status(500).json({
                status: 'fail',
                message: err.message,
            });
        }
    },
    ////////////////////////////////
    likePost: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { _id: userId } = req.user;
            if (!postId || !userId) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Missing input',
                });
            }
            const [updateErr, updatedPost] = await to(
                Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true })
                    .select('-body')
                    .populate({
                        path: 'tags',
                        select: 'name theme',
                    })
                    .populate({
                        path: 'author',
                        select: 'firstname lastname avatar',
                    }),
            );

            if (updateErr) {
                return res.status(500).json({
                    status: 'fail',
                    message: 'Like post failed',
                });
            }

            // Uncomment the following block if you want to send notifications
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
    },
    ////////////////////////////////
    unlikePost: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { _id: userId } = req.user;

            const [findError, postToUnlike] = await to(
                Post.findOne({ _id: postId, likes: userId })
                    .select('-body')
                    .populate({ path: 'tags', select: 'name theme' })
                    .populate({
                        path: 'author',
                        select: 'firstname lastname avatar',
                    }),
            );

            if (findError) {
                return next(findError);
            }

            if (!postToUnlike) {
                return res.status(404).json({
                    status: 'fail',
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
    },
    ////////////////////////////////
    bookmarkPost: async (req, res, next) => {
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
                ),
            );

            if (updateError) {
                return res.status(500).json({
                    status: 'fail',
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
                    status: 'fail',
                    message: 'Could not update user bookmarks',
                });
            }
            if (!updatedPost) {
                return res.status(404).json({
                    status: 'fail',
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
    },
    ////////////////////////////////
    unbookmarkPost: async (req, res, next) => {
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
                ),
            );

            if (updateError) {
                return res.status(500).json({
                    status: 'fail',
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
                    status: 'fail',
                    message: 'Could not update user bookmarks',
                });
            }

            if (!updatedPost) {
                return res.status(404).json({
                    status: 'fail',
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
    },
};

module.exports = PostController;
