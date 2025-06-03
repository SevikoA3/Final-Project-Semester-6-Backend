import { Router } from "express";
import { register, login, logout, refreshAccessToken } from "../controller/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/logout", logout);
router.post("/refresh-access-token", refreshAccessToken);

export default router;
