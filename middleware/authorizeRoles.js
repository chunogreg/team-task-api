const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
};

// const canModifyTasks = async (req, res, next) => {
//   const task = await Task.findById(req.params.id);
//   if (!task) {
//     res.status(404).json({ message: " Task not found" });
//   }
//   if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
//     return res
//       .status(403)
//       .json({ message: "Not allowed to modify this task " });
//   }

//   next();
// };

module.exports = authorizeRoles;
