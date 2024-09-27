import { Router } from "express";
import {
  getUsers,
  registration,
  login,
  getUser,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getUsers);
router.post("/register", registration);
router.post("/login", login);
router.get("/me", authenticate, getUser);
router.put("/update", authenticate, updateUser);
router.delete("/delete", authenticate, deleteUser);

export default router;
