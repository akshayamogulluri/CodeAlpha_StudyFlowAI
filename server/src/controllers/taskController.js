import Comment from "../models/Comment.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const canAccessProject = async (projectId, user) => {
  return Project.findOne({
    _id: projectId,
    $or: [{ owner: user._id }, { members: user.email }, { members: user.name }]
  });
};

export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.query;

    if (!projectId || !(await canAccessProject(projectId, req.user))) {
      return res.status(404).json({ message: "Project not found." });
    }

    const tasks = await Task.find({ projectId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedUser, status, priority, dueDate, projectId } = req.body;

    if (!title || !dueDate || !projectId) {
      return res.status(400).json({ message: "Task title, due date, and project are required." });
    }

    if (!(await canAccessProject(projectId, req.user))) {
      return res.status(404).json({ message: "Project not found." });
    }

    const task = await Task.create({
      title,
      description,
      assignedUser,
      status,
      priority,
      dueDate,
      projectId
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || !(await canAccessProject(task.projectId, req.user))) {
      return res.status(404).json({ message: "Task not found." });
    }

    const { title, description, assignedUser, status, priority, dueDate } = req.body;
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.assignedUser = assignedUser ?? task.assignedUser;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate ?? task.dueDate;

    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || !(await canAccessProject(task.projectId, req.user))) {
      return res.status(404).json({ message: "Task not found." });
    }

    await Comment.deleteMany({ taskId: task._id });
    await task.deleteOne();
    res.json({ message: "Task deleted." });
  } catch (error) {
    next(error);
  }
};
