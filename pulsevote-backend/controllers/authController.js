const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });

  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ email, password });
    const token = generateToken(user._id);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });

  const { email, password } = req.body;
  console.log('Login attempt for email:', email);
  
  try {
    const user = await User.findOne({ email });
    console.log('User found:', !!user);
    
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    console.log('Token generated for user:', user._id);
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Server error" });
  }
};
