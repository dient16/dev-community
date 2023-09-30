const mongoose = require('mongoose');

const DOCUMENT = 'Notification';
const COLLECTION = 'notification';

const notificationSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        date: {
            type: Date,
            default: Date.now,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
        type: {
            type: String,
            enum: ['like', 'follow', 'comment', 'reply'],
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model(DOCUMENT, notificationSchema, COLLECTION);
