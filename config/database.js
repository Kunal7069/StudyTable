const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create a Sequelize instance
const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
  dialect: "postgres",
  logging: false, // Disable logging SQL queries in console
});

module.exports = sequelize;
