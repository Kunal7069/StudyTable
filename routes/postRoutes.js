const express = require("express");
const { createPost, getPosts ,deletePost} = require("../controllers/postController");

const router = express.Router();

router.post("/posts", createPost); // Create new post
router.get("/posts", getPosts); // Get paginated posts
router.delete("/posts/:id", deletePost);
module.exports = router;
