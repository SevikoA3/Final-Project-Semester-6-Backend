import Item from "../model/Item.js";
import Category from "../model/Category.js";
import User from "../model/User.js";
import cloudinary from "../util/cloudinary.js";
import streamifier from "streamifier";

async function streamUpload(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

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
    const { name, description, quantity, category_id } = req.body;
    if (!name || !category_id) {
      return res
        .status(400)
        .json({ message: "Name and category_id are required" });
    }
    let image_url = null;
    if (req.file) {
      const uploadResult = await streamUpload(req.file.buffer, {
        folder: "items",
        unique_filename: true,
        overwrite: true,
      });
      image_url = uploadResult.secure_url;
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
    // Siapapun boleh edit, hapus pengecekan creator
    const { name, description, quantity, category_id } = req.body;
    let image_url = item.image_url;
    if (req.file) {
      const uploadResult = await streamUpload(req.file.buffer, {
        folder: "items",
        unique_filename: true,
        overwrite: true,
      });
      image_url = uploadResult.secure_url;
    }
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
    if (item.image_url) {
      const urlParts = item.image_url.split("/");
      const fileName = urlParts[urlParts.length - 1].split(".")[0];
      const publicId = `items/${fileName}`;
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Cloudinary delete error:", err.message);
      }
    }
    await item.destroy();
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
