import { Router } from "express";
import { chatController } from "../controller/chatController.js";

const router = Router();

router.post("/chat", chatController);

export default router;
