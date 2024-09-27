import { Router } from "express";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  addComment,
  toggleLike,
} from "./post.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, createPost);
router.get("/", getPosts);
router.put("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);

router.post("/:id/comment", authenticate, addComment);
router.post("/:id/like", authenticate, toggleLike);

export default router;
