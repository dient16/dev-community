const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const to = require('await-to-js').default;

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

        await Comment.populate(createdComment, { path: 'author' });
        post.comments.push(createdComment);
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

const getCommentsByPostId = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.user?._id;
        const post = await Post.findById(postId).populate({
            path: 'comments',
            match: { parentId: null },
            options: { sort: { createdAt: -1 } },
            populate: [
                {
                    path: 'author',
                    select: 'firstname lastname avatar username',
                },
                {
                    path: 'parentId',
                    match: { parentId: null },
                    populate: {
                        path: 'author',
                        select: 'firstname lastname avatar username',
                    },
                },
            ],
        });

        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
        }

        const comments = await Promise.all(
            post.comments.map(async (comment) => {
                const [err, replies] = await to(Comment.find({ parentId: comment._id }));
                if (err) {
                    return res.status(500).json({
                        status: 'error',
                        message: 'Error fetching replies',
                    });
                }

                const replyCount = replies.length;
                const commentObject = { ...comment.toObject(), replyCount };

                commentObject.isLiked =
                    Array.isArray(comment.likes) && comment.likes.some((like) => like.equals(userId));
                commentObject.likeCount = Array.isArray(comment.likes) ? comment.likes.length : 0;
                commentObject.replyCount = Array.isArray(replies) ? replies.length : 0;

                delete commentObject.likes;

                return commentObject;
            }),
        );

        return res.status(200).json({
            status: 'success',
            comments,
        });
    } catch (error) {
        next(error);
    }
};

const getRepliedByParentId = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.user?._id;
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

        if (repliedComment) {
            const repliedComments = await Promise.all(
                repliedComment.map(async (comment) => {
                    const replies = await Comment.find({ parentId: comment._id });
                    const commentObject = comment.toObject();
                    commentObject.isLiked =
                        Array.isArray(comment.likes) && comment.likes.some((like) => like.equals(userId));
                    commentObject.likeCount = Array.isArray(comment.likes) && comment.likes.length;
                    commentObject.replyCount = Array.isArray(replies) ? replies.length : 0;
                    delete commentObject.likes;
                    delete commentObject.replies;
                    return commentObject;
                }),
            );

            return res.status(200).json({
                status: 'success',
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

const likeComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { _id: userId } = req.user;

        if (!commentId || !userId) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing input',
            });
        }

        const existingComment = await Comment.findById(commentId);

        if (!existingComment) {
            return res.status(404).json({
                status: 'error',
                message: 'Comment not found',
            });
        }

        const [updateErr, updatedComment] = await to(
            Comment.findByIdAndUpdate(commentId, { $addToSet: { likes: userId } }, { new: true }).populate({
                path: 'author',
                select: 'firstname lastname avatar',
            }),
        );

        if (updateErr || !updatedComment) {
            return res.status(500).json({
                status: 'error',
                message: 'Like comment failed',
            });
        }

        const commentObject = updatedComment.toObject();
        commentObject.isLiked =
            Array.isArray(updatedComment.likes) && updatedComment.likes.some((like) => like.equals(userId));
        commentObject.likeCount = Array.isArray(updatedComment.likes) && updatedComment.likes.length;
        commentObject.replyCount = Array.isArray(updatedComment.replies) && updatedComment.replies.length;
        delete commentObject.likes;
        delete commentObject.replies;

        return res.status(200).json({
            status: 'success',
            message: 'Like comment successfully',
            comment: commentObject,
        });
    } catch (error) {
        next(error);
    }
};
const unlikeComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { _id: userId } = req.user;

        if (!commentId || !userId) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing input',
            });
        }

        const existingComment = await Comment.findById(commentId);

        if (!existingComment) {
            return res.status(404).json({
                status: 'error',
                message: 'Comment not found',
            });
        }

        const [updateErr, updatedComment] = await to(
            Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } }, { new: true }).populate({
                path: 'author',
                select: 'firstname lastname avatar',
            }),
        );

        if (updateErr || !updatedComment) {
            return res.status(500).json({
                status: 'error',
                message: 'Unlike comment failed',
            });
        }

        const commentObject = updatedComment.toObject();
        commentObject.isLiked =
            Array.isArray(updatedComment.likes) && updatedComment.likes.some((like) => like.equals(userId));
        commentObject.likeCount = Array.isArray(updatedComment.likes) ? updatedComment.likes.length : 0;
        commentObject.replyCount = Array.isArray(updatedComment.replies) ? updatedComment.replies.length : 0;
        delete commentObject.likes;
        delete commentObject.replies;

        return res.status(200).json({
            status: 'success',
            message: 'Unlike comment successfully',
            comment: commentObject,
        });
    } catch (error) {
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;

        if (!commentId) {
            return res.status(422).json({
                status: 'error',
                message: 'Invalid comment ID',
            });
        }

        let comment;

        [err, comment] = await to(Comment.findById(commentId));
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Error fetching comment',
            });
        }

        if (!comment) {
            return res.status(404).json({
                status: 'error',
                message: 'Comment not found',
            });
        }

        const postUpdate = await Post.findOneAndUpdate(
            { _id: comment.post },
            { $pull: { comments: commentId } },
            { new: true },
        );

        if (!postUpdate) {
            return res.status(500).json({
                status: 'error',
                message: 'Error updating post after comment deletion',
            });
        }

        [err] = await to(Comment.findByIdAndRemove(commentId));
        [err] = await to(Comment.deleteMany({ parentId: commentId }));

        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Error deleting comment',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Comment deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createComment,
    getRepliedByParentId,
    likeComment,
    unlikeComment,
    deleteComment,
    getCommentsByPostId,
};
