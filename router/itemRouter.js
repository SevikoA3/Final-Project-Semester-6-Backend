import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllItems, getItemById, createItem, updateItem, deleteItem } from "../controller/itemController.js";
import upload from "../util/multer.js";

const router = express.Router();

router.get("/items", verifyToken, getAllItems);
router.get("/items/:id", verifyToken, getItemById);
router.post("/items", verifyToken, upload.single("image"), createItem);
router.put("/items/:id", verifyToken, upload.single("image"), updateItem);
router.delete("/items/:id", verifyToken, deleteItem);

export default router;
