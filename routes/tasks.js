const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const { body, validationResult } = require("express-validator");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const { deleteTasks, getTasks } = require("../controller/taskController");
const canModifyTask = require("../middleware/canModifyTask.js");

//const asyncHandler = require("express-async-handler");

router.get(
  "/admin-only-route",
  (req, res, next) => {
    console.log("ADMIN-ONLY-ROUTE HIT");
    next();
  },
  authenticateToken,
  (req, res, next) => {
    console.log("AFTER AUTH");
    next();
  },
  authorizeRoles("admin"),
  (req, res) => {
    console.log("FINAL HANDLER"); // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }
    res.status(200).json({ message: "WELCOME ADMIN" });
  },
);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /api/tasks:
 *  get:
 *    summary: Get all tasks
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of tasks
 *      401:
 *        description: Not Authenticated
 *
 */

router.get(
  "/",
  authenticateToken,
  //authorizeRoles("user", "admin"),
  getTasks,
  async (req, res) => {
    //throw new Error("Async crash test");
    try {
      const filter = {};

      if (req.query.done !== undefined) {
        filter.done = req.query.done === "true";
      }
      const tasks = await Task.find(filter);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /api/tasks/{id}:
 *  get:
 *    summary: Get a single task
 *    tags: [Tasks]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    response:
 *      200:
 *        description: Task retreived
 */

router.get("/:id", authenticateToken, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: "task not found" });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *  put:
 *    summary: Update a task
 *    tags: [Tasks]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    response:
 *      200:
 *        description: Task updated
 */

router.put("/:id", async (req, res, next) => {
  try {
    const updateData = {};

    if (req.body.title !== undefined) {
      updateData.title = req.body.title;
    }

    if (req.body.done !== undefined) {
      updateData.done = req.body.done;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after", runValidators: true, context: "query" },
    );

    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ error: "task not found" });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *  delete:
 *    summary: Delete a task
 *    tags: [Tasks]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *        200:
 *          description: Task deleted
 */

router.delete(
  "/:id",
  authenticateToken,
  canModifyTask,
  deleteTasks,
  // authorizeRoles("admin"),
  async (req, res, next) => {
    try {
      const result = await Task.findByIdAndDelete(req.params.id);
      if (result) {
        res.status(200).json({
          message: "Task deleted successfully",
        });
      } else {
        res.status(404).json({ error: "data not found" });
      }
    } catch (error) {
      next(error);
    }
  },
);

//const { body, validationResult } = require("express-validator");

/**
 * @swagger
 * /api/tasks:
 *  post:
 *    summary: Create a new task
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                example: Finish project
 *    responses:
 *      201:
 *        description: Task created
 */
router.post(
  "/",
  [
    body("title")
      .isLength({ min: 3, max: 100 })
      .withMessage("title must be between 3 and 100 characters")
      .trim()
      .escape(),
    body("done")
      .optional()
      .isBoolean()
      .withMessage("done must be true or false")
      .toBoolean(),
  ],
  async (req, res) => {
    console.log("🔥 createTask HIT");
    //throw new Error("Test crash");
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ error: errors.array() });
      }

      const task = new Task({
        title: req.body.title,
        done: req.body.done,
      });

      const savedTask = await task.save();
      res.status(201).json(savedTask);
      console.log("Saved task:", savedTask);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
