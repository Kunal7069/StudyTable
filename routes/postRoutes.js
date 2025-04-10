const express = require("express");
const { createPost, getPosts } = require("../controllers/postController");

const router = express.Router();

router.post("/posts", createPost); // Create new post
router.get("/posts", getPosts); // Get paginated posts

module.exports = router;
