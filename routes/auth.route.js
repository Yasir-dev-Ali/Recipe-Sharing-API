import { Router } from "express";
import { register, login, verifyEmail, resetPassword, forgotPassword } from "../controllers/auth.controller.js";
const router = Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


export default router;

