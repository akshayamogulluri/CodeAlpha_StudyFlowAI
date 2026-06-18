import express from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  getStats,
  updateProject
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/stats", getStats);
router.get("/", getProjects);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
