const mongoose = require('mongoose');

const DOCUMENT = 'Post';
const COLLECTION = 'posts';

const postSchema = new mongoose.Schema(
    {
        title: { type: String, require: true },
        image: { type: String, require: true },
        body: { type: String, require: true },
        url: { type: String, require: true },
        date: { type: Date, default: Date.now() },
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
        bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    },
    {
        collection: COLLECTION,
    },
);

module.exports = mongoose.model(DOCUMENT, postSchema);
