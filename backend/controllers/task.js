import taskModel from "../models/task.js";
import dotenv from "dotenv";
dotenv.config();
import redisClient from "../utils/redis.js";

const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.user.userId;
    const newTask = new taskModel({
      title,
      description,
      status: status || "pending",
      userId,
    });
    await newTask.save();
    await redisClient.del(`tasks:${userId}`);
    return res.status(201).json(newTask);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cacheKey = `tasks:${userId}`;
    let tasks = await redisClient.get(cacheKey);
    if (tasks) return res.status(200).json(JSON.parse(tasks));
    tasks = await taskModel.find({ userId });
    await redisClient.set(cacheKey, JSON.stringify(tasks), { EX: 300 });
    return res.status(200).json(tasks);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.userId;
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (status) updateFields.status = status;
    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "At least one field required to update" });
    }
    const task = await taskModel.findOneAndUpdate(
      { _id: id, userId },
      updateFields,
      { new: true }
    );
    await redisClient.del(`tasks:${userId}`);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json(task);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const task = await taskModel.findOneAndDelete({ _id: id, userId });
    await redisClient.del(`tasks:${userId}`);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully", task });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskModel
      .find()
      .populate("userId", "username email role");
    return res.status(200).json(tasks);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const deleteAnyTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskModel.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully", task });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAllTasks,
  deleteAnyTask,
};
