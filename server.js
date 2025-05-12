const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const postRoutes = require("./routes/postRoutes");
const studentRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const educationRoutes = require("./routes/educationRoutes");

const http = require("http");          // <-- Add this for HTTP server
const WebSocket = require("ws");       // <-- WebSocket support

// Load environment variables
dotenv.config();
sequelize.sync({ alter: true });

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use("/api", postRoutes);
app.use("/api/student", studentRoutes); 
app.use('/api/otp', otpRoutes);
app.use("/api/education", educationRoutes);

// Set up HTTP server to attach WebSocket server to
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("Client connected via WebSocket");
  clients.add(ws);

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

// Broadcast function for notifications
function broadcast(message) {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}

// Add a simple test route to trigger notification
app.get("/api/notify", (req, res) => {
  const  message  = "finally done";
  broadcast({ type: "notification", message });
  res.status(200).json({ status: "Notification sent" });
});

// Start server
const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log("Database connected and synchronized.");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`WebSocket server listening on ws://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));