import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/:taskId", getComments);
router.post("/:taskId", addComment);

export default router;
