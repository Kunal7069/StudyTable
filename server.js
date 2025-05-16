// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const sequelize = require("./config/database");
// const postRoutes = require("./routes/postRoutes");
// const studentRoutes = require("./routes/authRoutes");
// const otpRoutes = require("./routes/otpRoutes");
// const educationRoutes = require("./routes/educationRoutes");

// const http = require("http");          // <-- Add this for HTTP server
// const WebSocket = require("ws");       // <-- WebSocket support

// // Load environment variables
// dotenv.config();
// sequelize.sync({ alter: true });

// // Initialize Express app
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Use routes
// app.use("/api", postRoutes);
// app.use("/api/student", studentRoutes); 
// app.use('/api/otp', otpRoutes);
// app.use("/api/education", educationRoutes);

// // Set up HTTP server to attach WebSocket server to
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// // Store connected clients
// const clients = new Set();

// // WebSocket connection handler
// wss.on("connection", (ws) => {
//   console.log("Client connected via WebSocket");
//   clients.add(ws);

//   ws.on("close", () => {
//     console.log("Client disconnected");
//     clients.delete(ws);
//   });
// });

// // Broadcast function for notifications
// function broadcast(message) {
//   for (const client of clients) {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(message));
//     }
//   }
// }

// // Add a simple test route to trigger notification
// app.get("/api/notify", (req, res) => {
//   const  message  = "finally done";
//   broadcast({ type: "notification", message });
//   res.status(200).json({ status: "Notification sent" });
// });

// // Start server
// const PORT = process.env.PORT || 5000;

// sequelize.sync()
//   .then(() => {
//     console.log("Database connected and synchronized.");
//     server.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//       console.log(`WebSocket server listening on ws://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => console.error("Database connection error:", err));


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const postRoutes = require("./routes/postRoutes");
const studentRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const educationRoutes = require("./routes/educationRoutes");

const http = require("http");
const WebSocket = require("ws");
const url = require("url");

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
app.use("/api/otp", otpRoutes);
app.use("/api/education", educationRoutes);

// Create HTTP server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Map to store connected users (userId => WebSocket)
const userConnections = new Map();

// WebSocket connection handler
wss.on("connection", (ws, req) => {
  const parameters = url.parse(req.url, true);
  const userId = parameters.query.userId;

  if (!userId) {
    ws.close();
    return;
  }

  console.log(`User ${userId} connected via WebSocket`);
  userConnections.set(userId, ws);

  ws.on("close", () => {
    console.log(`User ${userId} disconnected`);
    userConnections.delete(userId);
  });
});

// Broadcast message to all connected clients
function broadcast(message) {
  for (const ws of userConnections.values()) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
}

// Send message to specific user
function sendToUser(userId, message) {
  const client = userConnections.get(userId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
  } else {
    console.log(`User ${userId} is not connected`);
  }
}

// API to send notification to all users
app.get("/api/notify", (req, res) => {
  const message = "Broadcast notification to all users!";
  broadcast({ type: "notification", message });
  res.status(200).json({ status: "Broadcast notification sent" });
});

// API to send notification to a specific user via GET
// Example: /api/notify-user?userId=123&message=Hello
app.get("/api/notify-user", (req, res) => {
  const { userId, message } = req.query;

  if (!userId || !message) {
    return res.status(400).json({ error: "Missing userId or message" });
  }

  sendToUser(userId, { type: "notification", message });
  res.status(200).json({ status: `Notification sent to user ${userId}` });
});

// Start server
const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log("Database connected and synchronized.");
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`WebSocket server listening on ws://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));
