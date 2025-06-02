import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllItems, getItemById, createItem, updateItem, deleteItem } from "../controller/itemController.js";

const router = express.Router();

router.get("/items", verifyToken, getAllItems);
router.get("/items/:id", verifyToken, getItemById);
router.post("/items", verifyToken, createItem);
router.put("/items/:id", verifyToken, updateItem);
router.delete("/items/:id", verifyToken, deleteItem);

export default router;
