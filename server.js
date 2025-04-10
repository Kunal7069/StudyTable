const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const postRoutes = require("./routes/postRoutes");
const studentRoutes = require("./routes/authRoutes");
const otpRoutes = require('./routes/otpRoutes');
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use("/api", postRoutes);
app.use("/api/student", studentRoutes); 
app.use('/api/otp', otpRoutes);
// Sync database and start server
const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log("Database connected and synchronized.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));
