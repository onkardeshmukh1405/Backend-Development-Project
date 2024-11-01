const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/users");
const authMiddleware = require("../middlewares/authMiddleware");

// Create Post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newPostData = {
      title: req.body.title,
      content: req.body.content,
      author_id: req.userId,
    };

    const post = await Post.create(newPostData);

    const user = await User.findById(req.userId);
    user.posts.push(post._id);
    await user.save();

    res.status(201).send({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(400).send({
      message: "Post creation failed",
      success: false,
      err,
    });
  }
});

// GET Posts

router.get("/", authMiddleware, async (req, res) => {
  try {
    const Posts = await Post.find({});

    res.status(200).json({
      success: true,
      message: "Geting all Posts  Successfully",
      Posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET Single Post

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not Found",
      });
    }

    res.status(200).json({
      success: true,
      post,
      message: "Post found Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Update Post

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body);

    await post.save();

    res.status(200).json({
      success: true,
      message: "Update Post  Successfull",
      post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: " Update Post Failed",
    });
  }
});

// Delete Post

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: "false",
        message: "Post not found",
      });
    }

    if (post.author_id.toString() !== req.userId.toString()) {
      return res.status(401).json({
        success: "false",
        message: "Unauthorized",
      });
    }

    const user = await User.findById(req.userId);
    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);
    await user.save();

    await Post.findByIdAndDelete(req.params.id);

    return res.status(400).json({
      success: true,
      message: "Post is deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Post deletion Failed",
    });
  }
});

module.exports = router;
