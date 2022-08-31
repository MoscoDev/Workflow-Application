const mongoose = require("mongoose");
const express = require("express");
const { User, Post, Comment } = require("./model.js");
require("dotenv/config");
const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/signup/", async function (req, res) {
  try {
    const { email, username, phoneNumber, password } = req.body;
    let userExist = await User.findOne({ email: email });

    if (userExist) {
      return res
        .status(409)
        .json({ message: "duplicate user", success: false });
    } else {
      const user = new User({
        email,
        username,
        password,
        phoneNumber,
      });

      await user.save();
      return res.status(201).send({
        user: user,
        message: "user created",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error });
  }
});
app.post("/signup/editor", async function (req, res) {
  try {
    const { email, username, phoneNumber, password } = req.body;
    let userExist = await User.findOne({ email: email });

    if (userExist) {
      return res
        .status(409)
        .json({ message: "duplicate user", success: false });
    } else {
      const user = new User({
        email,
        username,
        password,
        phoneNumber,
        role: "editor",
      });

      await user.save();
      return res.status(201).send({
        user: user,
        message: "user created",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error });
  }
});
app.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    let userExist = await User.findOne({ email: email });

    if (userExist && userExist.password === password) {
      return res.status(200).json({
        message: "user logged in",
        success: true,
        id: userExist._id,
        userRole: userExist.role,
      });
    } else {
      return res.status(401).json({
        message: "invalid email or password",
        success: false,
      });
    }
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});
//only authors can write a post an editor can add comment to, approve or reject the post
// if the admin approves the post the author can publish
// if a post is approved other editors can't reject it or add further comment
// if author reject the post the author can review based on editor's comment
app.post("/post/new/:authorId", async (req, res) => {
  try {
    let { text, title } = req.body;
    const authorId = req.params.authorId;
    const author = await User.findById(authorId);
    console.log(author ? true : false);
    if (author.role == "author") {
      console.log(author.role);
      const newPost = new Post({ text, title, authorId });
      console.log(newPost);
      await newPost.save();
      if (!newPost) {
        res.status(409).json({
          success: false,
          message: "an error occurred",
        });
      } else {
        console.log(newPost);
        newPost.author = author;
        Post.findById(newPost._id)
          .populate("author")
          .exec(function (err, post) {
            if (err) return handleError(err);
            res.status(200).json({
              success: true,
              post: newPost,
              message: "post uploaded",
            });
          });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "unauthorized to perform this action",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "an error occurred" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const userID = req.body.userID;
    const user = await User.findById(userID);
    if (user.role == "author" || "editor") {
      const allPost = await Post.find();
      return res.status(200).json({
        message: "all published post",
        success: true,
        posts: allPost,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "unathorized access",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "an error occurred" });
  }
});

app.get("/post/:postId", async (req, res) => {
  try {
    const userID = req.body.userID;
    const postID = req.params.postId;
    const user = await User.findById(userID);
    if (user.role == "author" || "editor") {
      const post = await Post.findById(postID);
      return res.status(200).json({
        message: "Nah your post be this",
        success: true,
        posts: post,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "unathorized access",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "an error occurred" });
  }
});
app.put("/post/:postId", async (req, res) => {
  try {
    const userID = req.body.userID;
    const postID = req.params.postId;
    const user = await User.findById(userID);
    if (user.role ==  "editor") {
      const post = await Post.findById(postID);
      return res.status(200).json({
        message: "Nah your post be this",
        success: true,
        posts: post,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "unathorized access",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "an error occurred" });
  }
});

mongoose.connect(process.env.mongodb).then(console.log("db connected"));

app.listen(PORT, () => console.log("app listening to port " + PORT));
