const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Student = sequelize.define("Student", {
  admissionNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  marks: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      "10th": { maths: "0", science: "0" },
      "11th": { maths: "0", physics: "0", chemistry: "0" },
      "12th": { maths: "0", physics: "0", chemistry: "0" },
    },
  },
  subjects: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  competitive_exams: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // New fields (nullable)
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pinCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  boardMarksTarget: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rankTarget: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  targetExams: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  board: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  boardName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Student;
