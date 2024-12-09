// index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./config/db");
const User = require("./models/User");
const Task = require("./models/Task");
const crypto = require("crypto");
const apiKey = crypto.randomBytes(16).toString("hex");
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Middleware for authentication
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization; // Retrieve the Authorization header

  // Check if authHeader exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token format" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

  try {
    // Verify the token
    const decoded = jwt.verify(token, apiKey || SECRET_KEY);
    req.userId = decoded.id; // Attach userId to the request for further use
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: "Invalid Token" });
  }
};

// Register
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Get Tasks
app.get("/api/tasks", authenticate, async (req, res) => {
  const { status } = req.query;
  const query = {};

  if (status) query.status = status;
  //   if (ingredient) query.ingredients = { $in: [ingredient] };
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

app.get("/api/tasks/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    // Check if the task exists and belongs to the authenticated user
    if (!task || task.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Return the task details without modifying it
    res.json({ data: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create Task
app.post("/api/tasks", authenticate, async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      status,
      userId: req.userId,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Task
app.put("/api/tasks/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task || task.userId.toString() !== req.userId) {
    return res.status(404).json({ error: "Task not found" });
  }
  Object.assign(task, req.body);
  await task.save();
  res.json(task);
});

// Delete Task
app.delete("/api/tasks/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task || task.userId.toString() !== req.userId) {
    return res.status(404).json({ error: "Task not found" });
  }
  await task.deleteOne();
  res.json({ message: "Task deleted" });
});

// Start Server

const startServer = async () => {
  await connectDb();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
