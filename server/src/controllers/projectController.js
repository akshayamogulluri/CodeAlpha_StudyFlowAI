import Comment from "../models/Comment.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const memberMatcher = (user) => ({
  $or: [{ owner: user._id }, { members: user.email }, { members: user.name }]
});

export const getProjects = async (req, res, next) => {
  try {
    const search = req.query.search?.trim();
    const query = {
      ...memberMatcher(req.user),
      ...(search
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
              { members: { $regex: search, $options: "i" } }
            ]
          }
        : {})
    };

    if (search) {
      query.$and = [memberMatcher(req.user), { $or: query.$or }];
      delete query.$or;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { title, description, deadline, members = [] } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ message: "Project title and deadline are required." });
    }

    const project = await Project.create({
      title,
      description,
      deadline,
      members,
      owner: req.user._id
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });

    if (!project) {
      return res.status(404).json({ message: "Project not found or not editable." });
    }

    const { title, description, deadline, members } = req.body;
    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.deadline = deadline ?? project.deadline;
    project.members = members ?? project.members;

    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });

    if (!project) {
      return res.status(404).json({ message: "Project not found or not editable." });
    }

    const tasks = await Task.find({ projectId: project._id }).select("_id");
    await Comment.deleteMany({ taskId: { $in: tasks.map((task) => task._id) } });
    await Task.deleteMany({ projectId: project._id });
    await project.deleteOne();

    res.json({ message: "Project deleted." });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const projects = await Project.find(memberMatcher(req.user)).select("_id");
    const projectIds = projects.map((project) => project._id);
    const [totalTasks, completedTasks] = await Promise.all([
      Task.countDocuments({ projectId: { $in: projectIds } }),
      Task.countDocuments({ projectId: { $in: projectIds }, status: "completed" })
    ]);

    res.json({
      totalProjects: projects.length,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks
    });
  } catch (error) {
    next(error);
  }
};
