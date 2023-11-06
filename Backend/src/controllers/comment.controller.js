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
                message: 'Post not found! Please try again',
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
            comment: {
                ...createdComment.toObject(),
                replyCount: 0,
            },
        });
    } catch (error) {
        next(error);
    }
};
const getRepliedByParentId = async (req, res, next) => {
    await delay(1000);
    try {
        const { commentId } = req.params;
        let repliedComment;

        [err, repliedComment] = await to(
            Comment.find({
                parentId: commentId,
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
        const contentParentComment = await Comment.findById(commentId).select('content');
        const repliedComments = await Promise.all(
            repliedComment.map(async (comment) => {
                const replies = await Comment.find({ parentId: comment._id });
                return { ...comment.toObject(), replyCount: replies.length };
            }),
        );
        if (repliedComment) {
            return res.status(200).json({
                status: 'success',
                contentParent: contentParentComment.content,
                repliedComments,
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
    getRepliedByParentId,
};
