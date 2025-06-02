import User from "../model/User.js";
import Category from "../model/Category.js";
import Item from "../model/Item.js";
import db from "./db.js";

const association = async () => {
  try {
    // Item belongs to Category
    Item.belongsTo(Category, { as: "category", foreignKey: "category_id", targetKey: "id" });
    Category.hasMany(Item, { foreignKey: "category_id", sourceKey: "id" });

    // Item created by User
    Item.belongsTo(User, { as: "creator", foreignKey: "created_by", targetKey: "id" });
    User.hasMany(Item, { foreignKey: "created_by", sourceKey: "id" });

    // await db.sync({force: true});
    await db.sync();
  } catch (error) {
    console.log(error.message);
  }
};

export default association;
