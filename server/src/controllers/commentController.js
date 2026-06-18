import Comment from "../models/Comment.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const canAccessTask = async (taskId, user) => {
  const task = await Task.findById(taskId);
  if (!task) return null;

  const project = await Project.findOne({
    _id: task.projectId,
    $or: [{ owner: user._id }, { members: user.email }, { members: user.name }]
  });

  return project ? task : null;
};

export const getComments = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    if (!(await canAccessTask(taskId, req.user))) {
      return res.status(404).json({ message: "Task not found." });
    }

    const comments = await Comment.find({ taskId })
      .populate("userId", "name email avatar")
      .sort({ timestamp: 1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Comment message is required." });
    }

    if (!(await canAccessTask(taskId, req.user))) {
      return res.status(404).json({ message: "Task not found." });
    }

    const comment = await Comment.create({
      taskId,
      userId: req.user._id,
      message,
      timestamp: new Date()
    });

    const populated = await comment.populate("userId", "name email avatar");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};
