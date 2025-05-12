const express = require("express");
const {
  createClass,
  createSubject,
  createUnit,
  createChapter,
  createTopic,
  uploadSyllabusBatch,
  updateTopicsWithTags,
  updateAllTopicsBoardToCBSE,
  getFilteredTopics,
  getFilteredUserTopics,
  updateTopicRating
} = require("../controllers/educationController");

const router = express.Router();

// CREATE ROUTES
router.post("/class", createClass);
router.post("/subject", createSubject);
router.post("/unit", createUnit);
router.post("/chapter", createChapter);
router.post("/topic", createTopic);
router.post("/upload-batch", uploadSyllabusBatch);
router.post('/update-syllabus', updateTopicsWithTags);
router.get("/topics", getFilteredTopics);
router.post("/user-topics", getFilteredUserTopics);
router.post("/update-topic-rating", updateTopicRating);


router.put('/update-topics', updateAllTopicsBoardToCBSE);



module.exports = router;
