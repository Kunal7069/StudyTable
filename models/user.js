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
    type: DataTypes.JSON, // Storing marks as a JSON object
    allowNull: false,
    defaultValue: {
      "10th": { maths: "0", science: "0" },
      "11th": { maths: "0", physics: "0", chemistry: "0" },
      "12th": { maths: "0", physics: "0", chemistry: "0" },
    },
  },
  subjects: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Max 6 subjects
    allowNull: false,
    // validate: {
    //   len: [0, 6],
    // },
  },
  competitive_exams: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Max 2 exams
    allowNull: false,
    // validate: {
    //   len: [0, 2],
    // },
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Student;
