const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const to = require('await-to-js').default;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const createComment = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { parentId, content } = req.body;

        const { _id: author } = req.user;

        if (!postId || !content || !author) {
            return res.status(422).json({
                status: 'error',
                message: 'Invalid inputs passed, please check your data',
            });
        }

        let post, user, createdComment;

        [err, post] = await to(Post.findById(postId));
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Creating comment failed while fetching post',
            });
        }

        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found for the provided ID',
            });
        }

        [err, user] = await to(User.findById(author));
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Creating comment failed while fetching user',
            });
        }

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        [err, createdComment] = await to(
            Comment.create({
                parentId,
                post: postId,
                content,
                author,
            }),
        );

        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Creating comment failed while saving comment',
            });
        }

        [err] = await to(Comment.populate(createdComment, { path: 'author' }));
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Creating comment failed while populating author',
            });
        }

        post.comments.push(createdComment);
        createdComment.likes.push(author);

        [err] = await to(createdComment.save());
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Creating comment failed while saving comment',
            });
        }

        [err] = await to(post.save());
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Creating comment failed while saving post',
            });
        }

        res.status(201).json({
            status: 'success',
            comment: createdComment,
        });
    } catch (error) {
        next(error);
    }
};
const getRepliedByPostId = async (req, res, next) => {
    await delay(1000);
    try {
        const { commentId } = req.params;
        const { postId } = req.body;

        let repliedComment;

        [err, repliedComment] = await to(
            Comment.find({
                parentId: commentId,
                postId: postId,
            }).populate({
                path: 'author',
                select: 'firstname lastname avatar',
            }),
        );

        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Fetching replied comments failed',
            });
        }

        if (repliedComment) {
            return res.status(200).json({
                status: 'success',
                repliedComment,
            });
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'No replied comments found',
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createComment,
    getRepliedByPostId,
};
