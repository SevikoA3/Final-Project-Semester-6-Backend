import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../controller/categoryController.js";

const router = express.Router();

router.get("/categories", verifyToken, getAllCategories);
router.post("/categories", verifyToken, createCategory);
router.put("/categories/:id", verifyToken, updateCategory);
router.delete("/categories/:id", verifyToken, deleteCategory);

export default router;
