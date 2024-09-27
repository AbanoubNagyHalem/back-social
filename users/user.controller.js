import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../db/user.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const registration = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "This user already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res
      .status(201)
      .json({ message: "Registration successful", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password." });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      user: { username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getUser = async (req, res) => {
  const user = req.user;
  return res.status(200).json(user);
};

export const updateUser = async (req, res) => {
  const { username, email, password } = req.body;
  const user = req.user;

  if (username) user.username = username;
  if (email) user.email = email;

  if (password) {
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        message: "Password must be a string and at least 6 characters long",
      });
    }
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  return res.status(200).json({ message: "User updated successfully", user });
};

export const deleteUser = async (req, res) => {
  const user = req.user;

  await User.findByIdAndDelete(user.id);
  return res.status(200).json({ message: "User deleted successfully" });
};
