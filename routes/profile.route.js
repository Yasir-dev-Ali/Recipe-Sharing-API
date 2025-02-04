import { Router } from "express";
import { getProfile, updateProfile, followUser } from "../controllers/profile.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();
router.get("/profile",authMiddleware,  getProfile);
router.put("/profile", authMiddleware,  updateProfile);
router.put("/follow/:id",  followUser);

export default router;
