const Post = require("../models/post");

// Save a new post
exports.createPost = async (req, res) => {
  try {
    const { heading, content, tags, resources,category } = req.body;

    const newPost = await Post.create({
      heading,
      content,
      tags,
      resources,
      category
    });

    res.status(201).json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    res.status(500).json({ error: "Error creating post", details: error.message });
  }
};

// Get posts with pagination (10 per page)
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      limit,
      offset,
      order: [["date_of_posting", "DESC"]],
    });

    res.json({
      totalPosts: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      posts: rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts", details: error.message });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Post.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting post", details: error.message });
  }
};
