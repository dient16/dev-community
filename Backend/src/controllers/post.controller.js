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
            let query = Post.find(finalQuery).populate({ path: 'tags', select: '_id name' }).populate({
                path: 'author',
                select: 'firstname lastname avatar',
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
    createPost: async (req, res, next) => {
        console.log(req.body.tags.split(','));
        try {
            const { path: imageUrl } = req.file;

            const { title, body, tags } = req.body;
            const author = req.user._id;

            if (!title || !body || !tags || !imageUrl) {
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
    getAllPosts: async (req, res) => {
        let posts;
        try {
            posts = await Post.find().sort({ date: 'desc' }).populate('author').populate('tags');
        } catch (err) {
            return res.status(500).json({
                status: 'fail',
                message: 'Could not fetch posts, please try again',
            });
        }
        res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
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
};

module.exports = PostController;
