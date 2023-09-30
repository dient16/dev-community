const Comment = require('../models/comment.model');
const Post = require('../models/post.model');

const CommentController = {
    createComment: async (req, res, next) => {
        try {
            const { parentPost, body, author, date, parentId } = req.body;
            const { _id: userId } = req.user;
            if (!parentPost || !body || !author || !date || !parentId || !userId) {
                return res.status(422).json({
                    status: 'fail',
                    message: 'Invalid inputs passed, please check your data',
                });
            }

            let post;
            try {
                post = await Post.findById(parentPost); // Check if the post ID exists
                if (!post) {
                    return res.status(404).json({
                        status: 'fail',
                        message: 'Could not find post for provided ID',
                    });
                }
            } catch (err) {
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
            } catch (err) {
                return res.status(500).json({
                    status: 'fail',
                    message: 'Creating comment failed, please try again',
                });
            }

            let createdComment = new Comment({
                parentId,
                parentPost,
                body,
                author,
                date,
            });

            try {
                const session = await mongoose.startSession();
                session.startTransaction();
                createdComment = await Comment.populate(createdComment, { path: 'author' });
                post.comments.push(createdComment);
                user.comments.push(createdComment);
                createdComment.likes.push(author);
                await createdComment.save({ session: session });
                await post.save({ session: session });
                await user.save({ session: session });
                await session.commitTransaction();

                if (post.author.toString() !== userId) {
                    await commentNotification(
                        userId, // Sender
                        post.id,
                        createdComment.id,
                        post.author.toString(), // Author => Receiver
                    );
                }
            } catch (err) {
                return res.status(500).json({
                    status: 'fail',
                    message: 'Creating comment failed, please try again',
                });
            }

            res.status(201).json({
                status: 'success',
                comment: createdComment,
            });
        } catch (error) {
            next(error);
        }
    },
};
module.exports = CommentController;
