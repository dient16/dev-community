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
        name: { type: String, default: '' },
        email: { type: String, require: true, unique: true },
        password: { type: String, allowNull: true, default: null },
        avatar: {
            type: String,
            default: 'https://www.drupal.org/files/issues/default-avatar.png',
        },
        bio: { type: String, default: '404 bio not found' },
        links: { type: String, default: '' },
        joinDate: { type: Date, default: Date.now() },
        skills: { type: String, default: '' },
        location: { type: String, default: '' },
        work: { type: String, default: '' },
        education: { type: String, default: '' },
        theme: { type: String, default: '#000' },
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        followedTags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
        bookmarked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        verificationCode: { type: String, allowNull: true },
        isVerify: {
            type: Boolean,
            default: function () {
                return this.provider !== 'Email' ? true : false;
            },
            require: true,
        },
        provider: {
            type: String,
            enum: ['Email', 'Google', 'Facebook'],
            default: 'Email',
        },
        googleId: { type: String },
        resetPasswordToken: { type: String, allowNull: true },
        resetPasswordExpires: { type: Date, allowNull: true },
    },
    {
        collection: COLLECTION,
    },
);

module.exports = mongoose.model(DOCUMENT, userSchema);
