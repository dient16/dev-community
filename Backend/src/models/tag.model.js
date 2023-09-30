const mongoose = require('mongoose');
const DOCUMENT = 'Tag';
const COLLECTION = 'tags';

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        date: { type: Date, default: Date.now },
        posts: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Post' }],
        followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model(DOCUMENT, tagSchema, COLLECTION);
