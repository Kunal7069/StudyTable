const Student = require("../models/user");

// exports.getIncompleteProfiles = async (req, res) => {
//   try {
//     const students = await Student.find({});
//     res.json(students);
//   } catch (error) {
//     console.error("Error fetching students:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const Student = require("../models/user");

// exports.getIncompleteProfiles = async (req, res) => {
//   try {
//     const students = await Student.find({}); // Get all documents from Student collection
//     console.log(students)
//     // const students = ["hii","bye"]
//     return students; // Send as JSON
//   } catch (error) {
//     return error.message;
//   }
// };

exports.getIncompleteProfiles = async (req, res) => {
  try {
    const students = await Student.find({}); // Make sure Student is a Mongoose model!
    console.log(students);
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

