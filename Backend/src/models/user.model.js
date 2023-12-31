const mongoose = require('mongoose');

const COLLECTION = 'users';
const DOCUMENT = 'User';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
            default: function () {
                return this.email.split('@')[0];
            },
        },
        firstname: { type: String },
        lastname: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, allowNull: true, default: null },
        avatar: {
            type: String,
            default: 'https://www.drupal.org/files/issues/default-avatar.png',
        },
        bio: {
            type: String,
            default: 'bio is not set up yet',
        },
        links: {
            type: String,
            default: '',
        },
        skills: {
            type: String,
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        work: {
            type: String,
            default: '',
        },
        education: {
            type: String,
            default: '',
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        followedTags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag',
            },
        ],
        bookmarked: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model(DOCUMENT, userSchema, COLLECTION);
