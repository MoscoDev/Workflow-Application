const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  username: { type: String, unique: true },
  phoneNumber: String,
  role: { type: String, enum: ["editor", "author"], default: "author" },
});

// const postSchema = new mongoose.Schema({
//     post: String,
//     author: String,
//     comment: [{
//         comment: String,
//         editor: String,
//         Date:{type: Date, value: Date.now}
//     }]
// })
//  const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  text: {
    type: String,
    trim: true,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // each comment can only relates to one blog, so it's not in array
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});

exports.Comment = mongoose.model("Comment", commentSchema);

exports.Post = mongoose.model("Post", postSchema);

exports.User = mongoose.model("user", userSchema);
