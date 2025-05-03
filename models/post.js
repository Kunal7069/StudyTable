const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define("Post", {
  heading: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_of_posting: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings
    allowNull: false,
  },
  resources: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Array of URLs
    allowNull: false,
  },
});

module.exports = Post;
