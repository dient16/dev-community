const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const to = require('await-to-js').default;

const CommentController = {
    createComment: async (req, res, next) => {
        try {
            const { post: parentPost, content, parentId } = req.body;
            const { _id: author } = req.user;

            if (!parentPost || !content || !author) {
                return res.status(422).json({
                    status: 'fail',
                    message: 'Invalid inputs passed, please check your data',
                });
            }

            let post;
            try {
                post = await Post.findById(parentPost);
                if (!post) {
                    return res.status(404).json({
                        status: 'fail',
                        message: 'Could not find post for provided ID',
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    status: 'fail',
                    message: 'Creating comment failed, please try again',
                });
            }
            let user;
            try {
                user = await User.findById(author);
                if (!user) {
                    return res.status(404).json({
                        status: 'fail',
                        message: 'Could not find user for provided ID',
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    status: 'fail',
                    message: 'Creating comment failed, please try again',
                });
            }

            let createdComment = new Comment({
                parentId,
                post: parentPost,
                content,
                author,
            });

            try {
                createdComment = await Comment.populate(createdComment, { path: 'author' });
                post.comments.push(createdComment);
                user.comments.push(createdComment);
                createdComment.likes.push(author);

                await createdComment.save();
                await post.save();
                await user.save();

                res.status(201).json({
                    status: 'success',
                    comment: createdComment,
                });
            } catch (error) {
                return res.status(500).json({
                    status: 'fail',
                    message: error.message || error,
                });
            }
        } catch (error) {
            next(error);
        }
    },
};
module.exports = CommentController;
