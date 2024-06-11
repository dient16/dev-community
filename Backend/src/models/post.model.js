const mongoose = require('mongoose');

const DOCUMENT = 'Post';
const COLLECTION = 'posts';

const postSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         require: true,
      },
      image: {
         type: String,
         require: true,
      },
      body: {
         type: String,
         require: true,
      },
      slug: {
         type: String,
         require: true,
      },
      tags: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
         },
      ],
      likes: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
         },
      ],
      comments: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
         },
      ],
      bookmarks: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
         },
      ],
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         require: true,
      },
   },
   {
      timestamps: true,
   },
);

module.exports = mongoose.model(DOCUMENT, postSchema, COLLECTION);
