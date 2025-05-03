const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Class Model
const Class = sequelize.define("Class", {
  classNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
});

// Subject Model
const Subject = sequelize.define("Subject", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Unit Model
const Unit = sequelize.define("Unit", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Chapter Model
const Chapter = sequelize.define("Chapter", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Topic Model
const Topic = sequelize.define("Topic", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  boards: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  jee: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  neet: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Board: { // <-- make sure this matches your DB column
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// Relationships
Class.hasMany(Subject, { foreignKey: "classId" });
Subject.belongsTo(Class, { foreignKey: "classId" });

Subject.hasMany(Unit, { foreignKey: "subjectId" });
Unit.belongsTo(Subject, { foreignKey: "subjectId" });

Unit.hasMany(Chapter, { foreignKey: "unitId" });
Chapter.belongsTo(Unit, { foreignKey: "unitId" });

Chapter.hasMany(Topic, { foreignKey: "chapterId" });
Topic.belongsTo(Chapter, { foreignKey: "chapterId" });

// Export all models
module.exports = {
  Class,
  Subject,
  Unit,
  Chapter,
  Topic,
};
