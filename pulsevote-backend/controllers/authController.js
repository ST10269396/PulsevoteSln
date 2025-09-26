const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });

  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({
      email,
      password,
      roles: [{ organisationId: null, role: "user" }]
    });

    const token = generateToken(user);
    res.status(201).json({ message: "User registered", token });
  } catch (err) {
    res.status(500).json({ error: "Server error" + err});
  }
};

exports.registerManager = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const adminUser = await User.findById(req.user.id);
    if (!adminUser || !adminUser.roles.some(r => r.role === "admin")) {
      return res.status(403).json({ message: "Only admins can create managers" });
    }

    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const managerUser = await User.create({
      email,
      password,
      roles: [{ organisationId: null, role: "manager" }]
    });

    const token = generateToken(managerUser);
    res.status(201).json({ message: "Manager registered", token });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err });
  }
};

exports.registerAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });

  try {
    const { email, password } = req.body;

    const adminExists = await User.exists({ "roles.role": "admin" });

    if (adminExists) {
      const requestingUser = await User.findById(req.user.id);
      const isAdmin = requestingUser?.roles?.some(r => r.role === "admin");
      if (!isAdmin) {
        return res.status(403).json({ message: "Only admins can create admins" });
      }
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const adminUser = await User.create({
      email,
      password,
      roles: [{ organisationId: null, role: "admin" }]
    });

    const token = generateToken(adminUser);
    return res.status(201).json({ message: "Admin registered", token });
  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err });
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

    const token = generateToken(user);
    console.log('Token generated for user:', user._id);
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Server error" });
  }
};
