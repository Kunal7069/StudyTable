const { Class, Subject, Unit, Chapter, Topic } = require("../models/educationModels");
const { Op } = require("sequelize");

// Create a new Class
exports.createClass = async (req, res) => {
  try {
    const newClass = await Class.create({ classNumber: req.body.classNumber });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Subject under a Class
exports.createSubject = async (req, res) => {
  try {
    const { name, classId } = req.body;
    const newSubject = await Subject.create({ name, classId });
    res.status(201).json(newSubject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Unit under a Subject
exports.createUnit = async (req, res) => {
  try {
    const { name, subjectId } = req.body;
    const newUnit = await Unit.create({ name, subjectId });
    res.status(201).json(newUnit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Chapter under a Unit
exports.createChapter = async (req, res) => {
  try {
    const { name, unitId } = req.body;
    const newChapter = await Chapter.create({ name, unitId });
    res.status(201).json(newChapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Topic under a Chapter
exports.createTopic = async (req, res) => {
  try {
    const { name, boards, jee, neet, chapterId } = req.body;
    const newTopic = await Topic.create({ name, boards, jee, neet, chapterId });
    res.status(201).json(newTopic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadSyllabusBatch = async (req, res) => {
    try {
      const { classNumber, subjectName, syllabus, boards, jee, neet, Board } = req.body;
  
      // Create or find Class
      let classInstance = await Class.findOne({ where: { classNumber } });
      if (!classInstance) {
        classInstance = await Class.create({ classNumber });
      }
  
      // Create or find Subject
      let subjectInstance = await Subject.findOne({
        where: { name: subjectName, classId: classInstance.id },
      });
      if (!subjectInstance) {
        subjectInstance = await Subject.create({
          name: subjectName,
          classId: classInstance.id,
        });
      }
  
      for (const unit of syllabus) {
        let unitInstance = await Unit.findOne({
            where: {
              name: unit.unitName,
              subjectId: subjectInstance.id,
            },
          });
          if (!unitInstance) {
            unitInstance = await Unit.create({
              name: unit.unitName,
              subjectId: subjectInstance.id,
            });
          }
  
        for (const chapter of unit.chapters) {
            let chapterInstance = await Chapter.findOne({
                where: {
                  name: chapter.chapterName,
                  unitId: unitInstance.id,
                },
              });
              if (!chapterInstance) {
                chapterInstance = await Chapter.create({
                  name: chapter.chapterName,
                  unitId: unitInstance.id,
                });
              }
  
            for (const topic of chapter.topics) {
            const existingTopic = await Topic.findOne({
              where: {
                name: topic,
                chapterId: chapterInstance.id,
              },
            });
          
            if (existingTopic) {
              // Update existing topic flags
              await existingTopic.update({
                boards,
                jee,
                neet,
              });
            } else {
              // Create new topic
              await Topic.create({
                name: topic,
                boards,
                jee,
                neet,
                chapterId: chapterInstance.id,
                Board
              });
            }
          }
        }
      }
  
      res.status(201).json({ message: "Syllabus uploaded successfully." });
    } catch (error) {
      console.error("Error uploading syllabus:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


exports.updateTopicsWithTags= async (req,res)=> {

  const { topicNames, updates } = req.body;
  const matched = [];
  const unmatched = [];

  for (const name of topicNames) {
    console.log(name)
    const topic = await Topic.findOne({ where: { name } });

    if (topic) {
      console.log("1")
      await topic.update({
        boards: updates.boards || topic.boards,
        jee: updates.jee || topic.jee,
        neet: updates.neet || topic.neet,
      });
      console.log("2")
      matched.push(name);
    } else {
      console.log("3")
      unmatched.push(name);
    }
  }
  res.status(201).json({matchedCount: matched.length,
    unmatched, });
 
}
  
exports.updateAllTopicsBoardToCBSE = async (req, res) => {
  try {
    await Topic.update({ Board: 'CBSE' }, { where: {
      boards: {
        [Op.or]: ['yes', 'Yes']
      }
    }});
    res.status(200).json({ message: "All topics updated to CBSE." });
  } catch (error) {
    console.error("Error updating topics:", error);
    res.status(500).json({ error: "Failed to update topics." });
  }
};

exports.getFilteredTopics = async (req, res) => {
  try {
    const { classNumber, subjectName, jee, neet, boards } = req.query;

    const foundClass = await Class.findOne({ where: { classNumber } });
    if (!foundClass) return res.status(404).json({ error: "Class not found" });

    const subject = await Subject.findOne({
      where: { classId: foundClass.id, name: subjectName },
    });
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    const topics = await Topic.findAll({
      include: {
        model: Chapter,
        required: true,
        include: {
          model: Unit,
          required: true,
          where: { subjectId: subject.id },
        },
      },
      where: {
        ...(jee ? { jee: { [Op.iLike]: `%${jee}%` } } : {}),
        ...(neet ? { neet: { [Op.iLike]: `%${neet}%` } } : {}),
        ...(boards ? { boards: { [Op.iLike]: `%${boards}%` } } : {}),
      },
    });

    res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ error: "Failed to fetch topics." });
  }
};

  

