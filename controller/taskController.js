const Task = require("../models/task");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
  console.log(req.user);
};

const deleteTasks = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: " Task not found" });
    }
    await Task.deleteOne();
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getTasks, deleteTasks };
