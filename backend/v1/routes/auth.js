const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/register", (req, res) => {
  authController.registerUser(res, req.body);
});

router.post("/login", (req, res) => {
  authController.loginUser(res, req.body);
});

module.exports = router;
