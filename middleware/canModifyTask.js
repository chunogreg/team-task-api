const Task = require("../models/user");

const canModifyTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: " Task not found" });
    }
    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not allowed to modify this task " });
    }
    req.task = task;
    next();
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = canModifyTask;
