const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/todoApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Task Schema and Model
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

// API Routes

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
  // Add sorting and filtering options
  const sortBy = req.query.sortBy || 'createdAt';
  const filterCompleted = req.query.completed;
  
  let query = Task.find().select({
    text: 1,
    completed: 1,
    'progress.startDate': 1,
    'progress.dueDate': 1, 
    'progress.percentComplete': 1,
    'stats.timeSpent': 1,
    'stats.completedPoms': 1,
    'pomodoro.completedIntervals': 1
  });
  
  // Apply completed filter if specified
  if (filterCompleted !== undefined) {
    query = query.where('completed').equals(filterCompleted === 'true');
  }
  
  // Apply sorting
  query = query.sort(sortBy);
  
  const tasks = await query;
  res.json(tasks);
});

// Add a new task with Pomodoro timer, progress tracking and productivity stats
// Task schema updated to include:
// - pomodoro: {workInterval, breakInterval, completedIntervals}
// - progress: {startDate, dueDate, percentComplete} 
// - stats: {timeSpent, completedPoms}
app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update a task (toggle completed status)
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const apiUrl = 'http://localhost:5000/tasks'; // Backend API URL
