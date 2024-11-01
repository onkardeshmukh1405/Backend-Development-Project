const express = require("express");
const router = express.Router();
const Comment = require("../models/comments");
const Post = require("../models/posts");
const authMiddleware = require("../middlewares/authMiddleware");

// Create Comment
router.post("/:id", authMiddleware, async (req, res) => {
  try {
    const newCommentData = {
      content: req.body.content,
      author_id: req.userId,
      post_id: req.params.id,
    };

    const post = await Post.findById(req.params.id);

    const comment = await Comment.create(newCommentData);

    post.comments.push(comment._id);
    await post.save();

    res.status(201).send({
      success: true,
      data: comment,
    });
  } catch (err) {
    res.status(400).send({
      message: "Comment creation failed",
      success: false,
      err,
    });
  }
});

//  Read Comments
router.get("/", authMiddleware, async (req, res) => {
  try {
    const Posts = await Post.findById(req.query.post_id).populate("comments");

    // .populate("comments");
    const comments = Posts.comments;

    res.status(200).json({
      success: true,
      message: "Geting all Comments  Successfully",
      comments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//  Read single Comments
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.findById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Geting Single comment  Successfully",
      comments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//  Update Comment
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body);

    await comment.save();

    res.status(200).json({
      success: true,
      message: "Update Comment  Successfull",
      comment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: " Update Comment Failed",
    });
  }
});

// Delete Comment
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: "false",
        message: "comment not found",
      });
    }

    if (comment.author_id.toString() !== req.userId.toString()) {
      return res.status(401).json({
        success: "false",
        message: "Unauthorized",
      });
    }

    const post = await Post.findById(comment.post_id);
    const index = post.comments.indexOf(req.params.id);
    post.comments.splice(index, 1);
    await post.save();

    await Comment.findByIdAndDelete(req.params.id);

    return res.status(400).json({
      success: true,
      message: "Comment is deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Comment deletion Failed",
    });
  }
});

module.exports = router;
