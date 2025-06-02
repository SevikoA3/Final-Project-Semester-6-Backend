import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res
      .status(201)
      .json({ message: "User registered successfully", user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const { password: _, refreshToken: __, ...safeUserData } = user.toJSON();
    const accessToken = jwt.sign(safeUserData, process.env.JWT_SECRET, { expiresIn: "1m" });
    const refreshToken = jwt.sign(safeUserData, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "3d",
    });
    await User.update({ refreshToken }, { where: { id: user.id } });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 hari
    });
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken && req.body.refreshToken) {
      refreshToken = req.body.refreshToken;
    }
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
      }
      const { password: _, refreshToken:__, ...safeUserData } = user.toJSON();
      const accessToken = jwt.sign(safeUserData, process.env.JWT_SECRET, { expiresIn: "1m" });
      res.status(200).json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken && req.body.refreshToken) {
      refreshToken = req.body.refreshToken;
    }
    if (refreshToken) {
      await User.update({ refreshToken: null }, { where: { refreshToken } });
      res.clearCookie("refreshToken");
    }
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
