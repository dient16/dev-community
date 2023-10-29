const mongoose = require('mongoose');

const DOCUMENT = 'Comment';
const COLLECTION = 'comments';

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            require: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DOCUMENT,
            allowNull: true,
            default: null,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model(DOCUMENT, commentSchema, COLLECTION);
