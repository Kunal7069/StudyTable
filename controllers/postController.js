const Post = require("../models/post");

// Save a new post
exports.createPost = async (req, res) => {
  try {
    const { heading, content, tags, resources } = req.body;

    const newPost = await Post.create({
      heading,
      content,
      tags,
      resources,
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
