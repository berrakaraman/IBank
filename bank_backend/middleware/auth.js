//bank_backend/middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "Yetkilendirme reddedildi" });
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const secretKey =
      process.env.JWT_SECRET || "666c42109ae810c5ea4f25aa149b84d5";
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Geçersiz token" });
  }
};
