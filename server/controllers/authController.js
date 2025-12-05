import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper to create JWT
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 4. Generate token
    const token = createToken(user._id);

    res.status(201).json({ email, username, token, _id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Incorrect email" });
    }

    // 2. Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // 3. Generate token
    const token = createToken(user._id);

    // 4. Send response (Set isOnline to true temporarily here, usually handled by Socket)
    res.status(200).json({ email, username: user.username, token, _id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};