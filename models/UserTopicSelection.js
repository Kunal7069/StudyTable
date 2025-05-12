const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserTopicSelection = sequelize.define("UserTopicSelection", {
  admissionNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  topicName: DataTypes.STRING,
  boards: DataTypes.STRING,
  jee: DataTypes.STRING,
  neet: DataTypes.STRING,
  Board: DataTypes.STRING,
  chapter: DataTypes.STRING,
  unit: DataTypes.STRING,
  subject: DataTypes.STRING,
  classNumber: DataTypes.STRING,
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = UserTopicSelection;
