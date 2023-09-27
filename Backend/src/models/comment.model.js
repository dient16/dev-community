const mongoose = require('mongoose');

const DOCUMENT = 'Comment';
const COLLECTION = 'comments';

const commentSchema = new mongoose.Schema(
    {
        body: { type: String, require: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DOCUMENT,
            allowNull: true,
            default: null,
        },
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    },
    { collection: COLLECTION },
);

module.exports = mongoose.model(DOCUMENT, commentSchema, COLLECTION);
