const Tag = require('../models/tag.model');
const User = require('../models/user.model');
const Post = require('../models/post.model');

const tagController = {
    createTags: async (tags, post) => {
        try {
            for (const tag of tags) {
                const postTag = await Tag.findOneAndUpdate(
                    { name: tag.toLowerCase() },
                    { $addToSet: { posts: post._id } },
                    { upsert: true, new: true },
                );
                await Post.updateOne({ _id: post._id }, { $addToSet: { tags: postTag._id } });
            }

            return {
                result: 'success',
                message: 'Create tags successfully',
            };
        } catch (err) {
            throw err;
        }
    },
    removeTags: async (tags, post) => {
        let i = 0;
        for (const tag of post.tags) {
            if (!tags.includes(tag.name)) {
                await Tag.updateOne({ _id: post.tags[i]._id }, { $pull: { posts: post._id } });
                await Post.updateOne({ _id: post._id }, { $pull: { tags: post.tags[i]._id } });
            }
            i++;
        }
    },

    updateTags: async (tags, post) => {
        await createTags(tags, post);
        await removeTags(tags, post);
    },
    followTag: async (req, res, next) => {
        const { tagId, userId } = req.body;
        let tag;
        let user;
        try {
            tag = await Tag.findByIdAndUpdate(tagId, { $addToSet: { followers: userId } }, { new: true });
            user = await User.findByIdAndUpdate(userId, { $addToSet: { followedTags: tagId } }, { new: true }).populate(
                'followedTags',
            );
        } catch (err) {
            return res.status(500).json({
                result: 'fail',
                message: 'Could not follow tag',
            });
        }
        res.status(200).json({
            tag: tag.toObject({ getters: true }),
            user: user.toObject({ getters: true }),
        });
    },

    unfollowTag: async (req, res, next) => {
        const { tagId, userId } = req.body;
        let tag;
        let user;
        try {
            tag = await Tag.findByIdAndUpdate(tagId, { $pull: { followers: userId } }, { new: true });
            user = await User.findByIdAndUpdate(userId, { $pull: { followedTags: tagId } }, { new: true }).populate(
                'followedTags',
            );
        } catch (err) {
            return res.status(500).json({
                result: 'fail',
                message: 'Could not unfollow tag',
            });
        }
        res.status(200).json({
            tag: tag.toObject({ getters: true }),
            user: user.toObject({ getters: true }),
        });
    },
};

module.exports = tagController;
