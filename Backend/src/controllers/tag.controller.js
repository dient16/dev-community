const Tag = require('../models/tag.model');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const to = require('await-to-js').default;
const mongoose = require('mongoose');

const getTags = async (req, res, next) => {
   try {
      const { _id: userId } = req.user || {};
      const [tagsError, tags] = await to(Tag.find({}));
      if (tagsError) {
         throw new Error('Could not fetch tags, please try again');
      }

      const tagsWithIsLike = tags.map((tag) => {
         if (userId) {
            const isFollowing = tag.followers.includes(userId);
            return {
               ...tag.toObject(),
               isFollowing,
            };
         } else {
            return tag.toObject();
         }
      });

      return res.status(200).json({
         status: 'success',
         message: 'Get tags successfully',
         tags: tagsWithIsLike,
      });
   } catch (error) {
      next(error);
   }
};

const getTagsUser = async (req, res, next) => {
   try {
      const { _id: uid } = req.user;
      const user = await User.findById(uid).select('followedTags').populate({
         path: 'followedTags',
         select: 'name theme',
      });

      if (!user) {
         return res.status(404).json({
            status: 'fail',
            message: 'User not found',
         });
      }

      const tagsWithPostCount = await Tag.aggregate([
         {
            $match: {
               _id: { $in: user.followedTags.map((tag) => new mongoose.Types.ObjectId(tag._id)) },
            },
         },
         {
            $lookup: {
               from: 'posts',
               localField: 'posts',
               foreignField: '_id',
               as: 'posts',
            },
         },
         {
            $project: {
               name: 1,
               theme: 1,
               postsCount: { $size: '$posts' },
            },
         },
      ]);

      return res.status(200).json({
         status: 'success',
         message: 'Get tags successfully',
         tags: tagsWithPostCount,
      });
   } catch (error) {
      next(error);
   }
};
const getPopularTags = async (req, res, next) => {
   try {
      const [tagsError, popularTags] = await to(
         Tag.aggregate([
            {
               $lookup: {
                  from: 'posts',
                  localField: '_id',
                  foreignField: 'tags',
                  as: 'posts',
               },
            },
            {
               $project: {
                  name: 1,
                  theme: 1,
                  postCount: { $size: '$posts' },
               },
            },
            {
               $sort: { postCount: -1 },
            },
            {
               $limit: 10,
            },
         ]),
      );

      if (tagsError) {
         throw new Error('Could not fetch popular tags, please try again');
      }

      return res.status(200).json({
         status: 'success',
         message: 'Get popular tags successfully',
         tags: popularTags,
      });
   } catch (error) {
      next(error);
   }
};
const createTags = async (tags, post) => {
   for (const tag of tags) {
      const [error, postTag] = await to(
         Tag.findOneAndUpdate(
            { name: tag.toLowerCase() },
            { $addToSet: { posts: post._id } },
            { upsert: true, new: true },
         ),
      );
      if (error) {
         throw new Error('error creating tag');
      }
      await Post.updateOne({ _id: post._id }, { $addToSet: { tags: postTag._id } });
   }

   return {
      status: 'success',
      message: 'Create tags successfully',
   };
};
const removeTags = async (tags, post) => {
   for (const index in post.tags) {
      const tag = post.tags[index];
      if (!tags.includes(tag.name)) {
         await Tag.updateOne({ _id: tag._id }, { $pull: { posts: post._id } });
         await Post.updateOne({ _id: post._id }, { $pull: { tags: tag._id } });
      }
   }
};

const updateTags = async (tags, post) => {
   await removeTags(tags, post);
   await createTags(tags, post);
};
const followTag = async (req, res, next) => {
   try {
      const { tagId } = req.params;
      const { _id: userId } = req.user;
      const [tagUpdateError, updatedTag] = await to(
         Tag.findByIdAndUpdate(tagId, { $addToSet: { followers: userId } }, { new: true }),
      );

      const [userUpdateError] = await to(
         User.findByIdAndUpdate(
            userId,
            { $addToSet: { followedTags: tagId } },
            { new: true },
         ).populate('followedTags'),
      );

      if (tagUpdateError || userUpdateError) {
         throw new Error('Could not follow tag');
      }

      const isFollowing = updatedTag.followers.includes(userId);

      res.status(200).json({
         status: 'success',
         tag: updatedTag,
         isFollowing,
      });
   } catch (error) {
      next(error);
   }
};
const unfollowTag = async (req, res, next) => {
   try {
      const { tagId } = req.params;
      const { _id: userId } = req.user;
      const [tagUpdateError, updatedTag] = await to(
         Tag.findByIdAndUpdate(tagId, { $pull: { followers: userId } }, { new: true }),
      );

      const [userUpdateError] = await to(
         User.findByIdAndUpdate(userId, { $pull: { followedTags: tagId } }, { new: true }).populate(
            'followedTags',
         ),
      );

      if (tagUpdateError || userUpdateError) {
         throw new Error('Could not unfollow tag');
      }

      const isFollowing = updatedTag.followers.includes(userId);

      res.status(200).json({
         status: 'success',
         tag: updatedTag.toObject({ getters: true }),
         isFollowing,
      });
   } catch (error) {
      next(error);
   }
};

module.exports = {
   getTags,
   unfollowTag,
   getTagsUser,
   updateTags,
   followTag,
   getPopularTags,
   createTags,
};
