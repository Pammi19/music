const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  register,
  login,
  logout,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

module.exports = router;