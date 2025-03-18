// routes/userRoutes.js
const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/register", userController.register);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Geçerli bir email girin"),
    body("password").notEmpty().withMessage("Şifre gereklidir"),
  ],
  userController.login
);
router.get("/me", auth, userController.getMe);
router.put("/me", auth, userController.updateProfile);

module.exports = router;
