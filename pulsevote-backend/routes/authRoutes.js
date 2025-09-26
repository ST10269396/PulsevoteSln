const express = require("express");
const { body } = require("express-validator");
const { registerUser, registerManager, registerAdmin, login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { registerLimiter, loginLimiter } = require("../middleware/rateLimiter");
const router = express.Router();

// Validators
const emailValidator = body("email")
  .isEmail().withMessage("Email must be valid")
  .normalizeEmail();

const passwordStrongValidator = body("password")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  .matches(/[A-Za-z]/).withMessage("Password must include a letter")
  .matches(/\d/).withMessage("Password must include a number")
  .trim()
  .escape();

const passwordValidator = body("password")
  .notEmpty().withMessage("Password is required")
  .trim()
  .escape();

// remove /register endpoint and include these ones.
router.post("/register-user", registerLimiter, [emailValidator, passwordStrongValidator], registerUser);
router.post("/register-manager", protect, requireRole("admin"), registerLimiter, [emailValidator, passwordStrongValidator], registerManager);
router.post("/register-admin", registerLimiter, [emailValidator, passwordStrongValidator], registerAdmin);

router.post("/login", loginLimiter, [emailValidator, passwordValidator], login);

module.exports = router;
