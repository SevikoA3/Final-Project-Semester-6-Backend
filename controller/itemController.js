import Item from "../model/Item.js";
import Category from "../model/Category.js";
import User from "../model/User.js";

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
      order: [["id", "DESC"]],
    });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const { name, description, image_url, quantity, category_id } = req.body;
    if (!name || !category_id) {
      return res.status(400).json({ message: "Name and category_id are required" });
    }
    const item = await Item.create({
      name,
      description,
      image_url,
      quantity,
      category_id,
      created_by: req.userId,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.created_by !== req.userId) {
      return res.status(403).json({ message: "Forbidden: Not your item" });
    }
    const { name, description, image_url, quantity, category_id } = req.body;
    await item.update({ name, description, image_url, quantity, category_id });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.created_by !== req.userId) {
      return res.status(403).json({ message: "Forbidden: Not your item" });
    }
    await item.destroy();
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
