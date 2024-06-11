const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Tag = require('../models/tag.model');
const tag = require('./tag.controller');
const slugify = require('slugify');
const cloudinary = require('../config/cloudinary.config');
const to = require('await-to-js').default;

const getPosts = async (req, res, next) => {
   const { _id: userId } = req.user || {};

   try {
      let query = Post.find()
         .select('-body')
         .populate({ path: 'tags', select: '_id name theme' })
         .populate({
            path: 'author',
            select: 'firstname lastname avatar username',
         });

      if (req.query.fields) {
         const selectedFields = req.query.fields.split(',').join(' ');
         query = query.select(selectedFields);
      }

      if (req.query.latest) {
         query = query.sort('-createdAt');
      }

      if (req.query.top) {
         query = query.sort('likes.length');
      }

      let tagName = '';
      let tagColor = '';
      if (req.query.tag) {
         const tagId = req.query.tag;
         const [tagError, tagDetails] = await to(Tag.findById(tagId).select('name theme').exec());
         if (tagError || !tagDetails) {
            throw new Error('Could not fetch tag details, please try again');
         }
         tagName = tagDetails.name;
         tagColor = tagDetails.theme;
         query = query.where('tags').equals(tagId);
      }

      if (userId && req.query.foryou) {
         const [tagsError, tagsUser] = await to(
            User.findById(userId).select('followedTags').populate({
               path: 'followedTags',
            }),
         );
         if (tagsError) {
            throw new Error('Could not fetch tags, please try again');
         }

         const followedTags = tagsUser.followedTags.map((tag) => tag._id.toString());
         query = query.where('tags').in(followedTags);
      }

      const page = req.query.page || 1;
      const limit = req.query.limit || 5;
      const skip = (page - 1) * limit;

      query.skip(skip).limit(limit);

      let [error, posts] = await to(query.exec());
      if (error) {
         return res.status(500).json({
            status: 'error',
            message: 'Fetch posts error',
         });
      }

      posts = posts.map((post) => {
         const postObject = post.toObject();
         postObject.likeCount = post.likes.length;
         postObject.commentCount = post.comments.length;
         delete postObject.bookmarks;
         delete postObject.likes;
         delete postObject.comments;

         if (userId) {
            postObject.isLiked = post.likes.some((like) => like.equals(userId));
            postObject.isBookmarked = post.bookmarks.some((bookmark) => bookmark.equals(userId));
         }
         return postObject;
      });

      return res.status(200).json({
         status: 'success',
         count: posts.length,
         posts: posts,
         tagName: req.query.tag ? tagName : undefined,
         tagColor: req.query.tag ? tagColor : undefined,
      });
   } catch (error) {
      next(error);
   }
};
const getPostByTagsDiscuss = async (req, res, next) => {
   try {
      const [err, tag] = await to(
         Tag.findOne({
            name: 'discuss',
         }).populate({
            path: 'posts',
         }),
      );

      if (err) {
         return res.status(500).json({
            status: 'error',
            message: 'Error fetching tag',
            error: err.message,
         });
      }

      if (!tag) {
         return res.status(404).json({
            status: 'error',
            message: 'Tag not found',
         });
      }

      return res.status(200).json({
         status: 'success',
         posts: tag.posts || [],
      });
   } catch (error) {
      next(error);
   }
};

const uploadImage = async (req, res, next) => {
   try {
      if (!req?.file) {
         return res.status(400).json({
            status: 'error',
            message: 'Upload image fail',
         });
      }
      const { path: imageUrl } = req.file;
      if (imageUrl) {
         return res.status(200).json({
            status: 'success',
            message: 'Upload image successfully',
            imageUrl,
         });
      } else {
         return res.status(500).json({
            status: 'error',
            message: 'Upload image fail',
         });
      }
   } catch (error) {
      next(error);
   }
};
const searchPost = async (req, res, next) => {
   try {
      const { q } = req.query;
      const [err, posts] = await to(
         Post.find({ title: { $regex: q, $options: 'i' } })
            .select('title createdAt')
            .limit(4)
            .populate({
               path: 'author',
               select: 'firstname lastname avatar username',
            }),
      );
      if (err) {
         return res.status(500).json({
            status: 'error',
            message: 'Search error',
         });
      }

      return res.status(200).json({
         status: 'success',
         data: posts.map((post) => post.toObject()),
      });
   } catch (error) {
      next(error);
   }
};

const getPost = async (req, res, next) => {
   try {
      const { pid } = req.params;
      let queryFields;
      if (req.query.fields) {
         queryFields = req.query.fields.split(',').join(' ');
      }

      const [err, post] = await to(
         Post.findById(pid)
            .populate({
               path: 'tags',
               select: 'name theme',
            })
            .select(queryFields)
            .populate({
               path: 'author',
               select:
                  '-password -refreshToken -followedTags -tags -posts -updatedAt -createdAt -bookmarked',
            })
            .populate({
               path: 'likes',
               select: 'avatar username',
            }),
      );

      if (err) {
         return res.status(500).json({
            status: 'error',
            message: 'Fetch post error',
         });
      }

      if (!post) {
         return res.status(404).json({
            status: 'error',
            message: 'Post not found',
         });
      }

      let postObject = post.toObject();
      delete postObject.bookmarks;
      if (req.user) {
         const userId = req.user._id;
         postObject.isLiked = (post || []).likes.some((like) => like.equals(userId));
         postObject.isBookmarked = (post || []).bookmarks.some((bookmark) =>
            bookmark.equals(userId),
         );
         const isFollow = postObject.author.followers.some((follower) => follower.equals(userId));
         postObject.author.isFollow = isFollow;
      }
      postObject.commentCount = (post.comments && post.comments.length) || 0;
      postObject.likeCount = (post.likes && post.likes.length) || 0;
      delete postObject.comments;
      delete postObject.author.followers;
      delete postObject.author.following;
      return res.status(200).json({
         status: 'success',
         data: {
            ...postObject,
         },
      });
   } catch (error) {
      next(error);
   }
};

const createPost = async (req, res, next) => {
   try {
      if (!req?.file) {
         return res.status(400).json({
            status: 'error',
            message: 'Missing image in the request',
         });
      }

      const { path: imageUrl } = req.file;
      const { title, body, tags } = req.body;
      const author = req.user._id;

      let postCreateErr, newPost, tagCreateErr, userFindErr, user, saveUserErr;

      [postCreateErr, newPost] = await to(
         Post.create({
            title,
            image: imageUrl,
            body,
            slug: slugify(title),
            author,
         }),
      );

      if (postCreateErr) {
         return res.status(500).json({
            status: 'error',
            message: 'Creating post failed',
         });
      }

      [tagCreateErr] = await to(tag.createTags(tags.split(','), newPost));

      if (tagCreateErr) {
         return res.status(500).json({
            status: 'error',
            message: 'Creating tag failed',
         });
      }

      [userFindErr, user] = await to(User.findById(author));

      if (userFindErr) {
         return res.status(500).json({
            status: 'error',
            message: 'Fetching user failed',
         });
      }

      if (!user) {
         return res.status(404).json({
            status: 'error',
            message: 'User not found!',
         });
      }

      user.posts.push(newPost);

      [saveUserErr] = await to(user.save());

      if (saveUserErr) {
         return res.status(500).json({
            status: 'error',
            message: 'Saving user failed',
         });
      }

      return res.status(201).json({
         status: 'success',
         post: await newPost.populate({
            path: 'author',
            select: '-refreshToken -password -posts',
         }),
      });
   } catch (error) {
      next(error);
   }
};

const updatePost = async (req, res, next) => {
   try {
      const { postId } = req.params;
      const { _id: uid } = req.user;
      const imageUrl = req.file ? req.file.path : null;
      const { body, title, tags } = req.body;
      let objUpdate;
      if (imageUrl) {
         objUpdate = { body, title, image: imageUrl };
      } else {
         objUpdate = { body, title };
      }
      const [err, post] = await to(Post.findById(postId).populate('tags'));

      if (err) {
         return res.status(500).json({
            status: 'error',
            message: 'Fetching post failed',
         });
      }

      if (!post) {
         return res.status(404).json({
            status: 'error',
            message: 'Post not found',
         });
      }
      if (post.author.toString() !== uid.toString()) {
         return res.status(401).json({
            status: 'error',
            message: 'You are not allowed to update the post',
         });
      }
      let postUpdateErr, tagUpdateErr, postUpdate;
      [postUpdateErr, postUpdate] = await to(
         Post.findByIdAndUpdate(
            postId,
            {
               ...objUpdate,
            },
            { new: true },
         ),
      );

      if (postUpdateErr) {
         return res.status(500).json({
            status: 'error',
            message: 'Updating post failed',
         });
      }

      [tagUpdateErr] = await to(tag.updateTags(tags.split(','), postUpdate));

      if (tagUpdateErr) {
         return res.status(500).json({
            status: 'error',
            message: 'Updating tags failed',
         });
      }

      return res.status(200).json({
         status: 'success',
         message: 'Post updated successfully',
      });
   } catch (error) {
      next(error);
   }
};

const deletePost = async (req, res, next) => {
   const { postId } = req.params;
   try {
      const post = await Post.findByIdAndDelete(postId);
      if (post) {
         const publicId = post.image.match(/\/([^/]+)$/)[1].split('.')[0];
         await cloudinary.uploader.destroy(publicId);
         await Comment.deleteMany({ post: postId });
         const authorId = post.author;
         await User.findByIdAndUpdate(authorId, { $pull: { posts: postId } });
         const tagIds = post.tags || [];
         await Tag.updateMany({ _id: { $in: tagIds } }, { $pull: { posts: postId } });

         return res.status(200).json({
            status: 'success',
            message: 'Post deleted successfully',
         });
      } else {
         return res.status(404).json({
            status: 'error',
            message: 'Post not found',
         });
      }
   } catch (err) {
      next(err);
   }
};
const likePost = async (req, res, next) => {
   try {
      const { postId } = req.params;
      const { _id: userId } = req.user;
      if (!postId || !userId) {
         return res.status(400).json({
            status: 'error',
            message: 'Missing input',
         });
      }
      const existingPost = await Post.findById(postId);
      if (!existingPost) {
         return res.status(404).json({
            status: 'error',
            message: 'Post not found',
         });
      }
      const [updateErr, updatedPost] = await to(
         Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true })
            .select('-body')
            .populate({
               path: 'tags',
               select: 'name theme',
            })
            .populate({
               path: 'author',
               select: 'firstname lastname avatar',
            }),
      );

      if (updateErr || !updatedPost) {
         return res.status(500).json({
            status: 'error',
            message: 'Like post failed',
         });
      }

      const postObject = updatedPost.toObject();
      postObject.isLiked =
         Array.isArray(updatedPost.likes) && updatedPost.likes.some((like) => like.equals(userId));
      postObject.isBookmarked =
         Array.isArray(updatedPost.bookmarks) &&
         updatedPost.bookmarks.some((bookmark) => bookmark.equals(userId));
      postObject.likeCount = Array.isArray(updatedPost.likes) ? updatedPost.likes.length : 0;
      postObject.commentCount = Array.isArray(updatedPost.comments)
         ? updatedPost.comments.length
         : 0;
      delete postObject.bookmarks;
      delete postObject.likes;
      delete postObject.comments;
      return res.status(200).json({
         status: 'success',
         message: 'Like post successfully',
         post: postObject,
      });
   } catch (error) {
      next(error);
   }
};

const unlikePost = async (req, res, next) => {
   try {
      const { postId } = req.params;
      const { _id: userId } = req.user;
      if (!postId || !userId) {
         return res.status(400).json({
            status: 'error',
            message: 'Missing input',
         });
      }
      const existingPost = await Post.findById(postId);
      if (!existingPost) {
         return res.status(404).json({
            status: 'error',
            message: 'Post not found',
         });
      }
      const [updateErr, updatedPost] = await to(
         Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true })
            .select('-body')
            .populate({
               path: 'tags',
               select: 'name theme',
            })
            .populate({
               path: 'author',
               select: 'firstname lastname avatar',
            }),
      );
      if (updateErr) {
         return res.status(500).json({
            status: 'error',
            message: 'Unlike post failed',
         });
      }

      const postObject = updatedPost.toObject();
      postObject.isLiked =
         Array.isArray(updatedPost.likes) && updatedPost.likes.some((like) => like.equals(userId));
      postObject.isBookmarked =
         Array.isArray(updatedPost.bookmarks) &&
         updatedPost.bookmarks.some((bookmark) => bookmark.equals(userId));
      postObject.likeCount = Array.isArray(updatedPost.likes) ? updatedPost.likes.length : 0;
      postObject.commentCount = Array.isArray(updatedPost.comments)
         ? updatedPost.comments.length
         : 0;
      delete postObject.bookmarks;
      delete postObject.likes;
      delete postObject.comments;

      return res.status(200).json({
         status: 'success',
         message: 'Unlike post successfully',
         post: postObject,
      });
   } catch (error) {
      next(error);
   }
};

const bookmarkPost = async (req, res, next) => {
   try {
      const { postId } = req.params;
      const { _id: userId } = req.user;

      const [updateError, updatedPost] = await to(
         Post.findByIdAndUpdate(
            postId,
            {
               $addToSet: { bookmarks: userId },
            },
            { new: true },
         )
            .select('-body')
            .populate({
               path: 'tags',
               select: 'name theme',
            })
            .populate({
               path: 'author',
               select: 'firstname lastname avatar',
            }),
      );

      if (updateError) {
         return res.status(500).json({
            status: 'error',
            message: 'Could not bookmark post',
         });
      }
      const [userUpdateError] = await to(
         User.findByIdAndUpdate(
            userId,
            {
               $addToSet: { bookmarked: postId },
            },
            { new: true },
         ),
      );

      if (userUpdateError) {
         return res.status(500).json({
            status: 'error',
            message: 'Could not update user bookmarks',
         });
      }
      if (!updatedPost) {
         return res.status(404).json({
            status: 'error',
            message: 'Post not found',
         });
      }
      const postObject = updatedPost.toObject();
      postObject.isLiked =
         Array.isArray(updatedPost.likes) && updatedPost.likes.some((like) => like.equals(userId));
      postObject.isBookmarked =
         Array.isArray(updatedPost.bookmarks) &&
         updatedPost.bookmarks.some((bookmark) => bookmark.equals(userId));
      postObject.likeCount = Array.isArray(updatedPost.likes) ? updatedPost.likes.length : 0;
      postObject.commentCount = Array.isArray(updatedPost.comments)
         ? updatedPost.comments.length
         : 0;
      delete postObject.bookmarks;
      delete postObject.likes;
      delete postObject.comments;

      return res.status(200).json({
         status: 'success',
         post: postObject,
      });
   } catch (error) {
      next(error);
   }
};
const unbookmarkPost = async (req, res, next) => {
   try {
      const { postId } = req.params;
      const { _id: userId } = req.user;

      const [updateError, updatedPost] = await to(
         Post.findByIdAndUpdate(
            postId,
            {
               $pull: { bookmarks: userId },
            },
            { new: true },
         )
            .select('-body')
            .populate({
               path: 'tags',
               select: 'name theme',
            })
            .populate({
               path: 'author',
               select: 'firstname lastname avatar',
            }),
      );

      if (updateError) {
         return res.status(500).json({
            status: 'error',
            message: 'Could not unbookmark post',
         });
      }

      const [userUpdateError] = await to(
         User.findByIdAndUpdate(
            userId,
            {
               $pull: { bookmarked: postId },
            },
            { new: true },
         ),
      );

      if (userUpdateError) {
         return res.status(500).json({
            status: 'error',
            message: 'Could not update user bookmarks',
         });
      }

      if (!updatedPost) {
         return res.status(404).json({
            status: 'error',
            message: 'Post not found',
         });
      }
      const postObject = updatedPost.toObject();
      postObject.isLiked =
         Array.isArray(updatedPost.likes) && updatedPost.likes.some((like) => like.equals(userId));
      postObject.isBookmarked =
         Array.isArray(updatedPost.bookmarks) &&
         updatedPost.bookmarks.some((bookmark) => bookmark.equals(userId));
      postObject.likeCount = Array.isArray(updatedPost.likes) ? updatedPost.likes.length : 0;
      postObject.commentCount = Array.isArray(updatedPost.comments)
         ? updatedPost.comments.length
         : 0;
      delete postObject.bookmarks;
      delete postObject.likes;
      delete postObject.comments;
      return res.status(200).json({
         status: 'success',
         post: postObject,
      });
   } catch (error) {
      next(error);
   }
};
const getBookmarkUser = async (req, res, next) => {
   try {
      const { _id: uid } = req.user;

      const [err, user] = await to(
         User.findById(uid).populate({
            path: 'bookmarked',
            select: 'title author createdAt tags',
            populate: [
               { path: 'tags', select: 'name theme' },
               { path: 'author', select: 'firstname lastname avatar username' },
            ],
         }),
      );

      if (err) {
         return res.status(500).json({
            status: 'error',
            message: 'Something went wrong with the server',
         });
      }

      if (!user) {
         return res.status(401).json({
            status: 'error',
            message: 'Could not find bookmark user',
         });
      }

      return res.status(200).json({ posts: user?.bookmarked || [] });
   } catch (error) {
      next(error);
   }
};

module.exports = {
   getPosts,
   uploadImage,
   getPost,
   createPost,
   updatePost,
   deletePost,
   unlikePost,
   likePost,
   bookmarkPost,
   unbookmarkPost,
   searchPost,
   getPostByTagsDiscuss,
   getBookmarkUser,
};
