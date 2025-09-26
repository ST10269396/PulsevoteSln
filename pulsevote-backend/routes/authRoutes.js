const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");
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

const passwordPresentValidator = body("password")
  .notEmpty().withMessage("Password is required")
  .trim()
  .escape();

router.post("/register", [emailValidator, passwordStrongValidator], register);
router.post("/login", [emailValidator, passwordPresentValidator], login);

module.exports = router;
