import { Router } from "express";
import { register, login, verifyEmail } from "../controllers/auth.controller.js";
const router = Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);


export default router;

