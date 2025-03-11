const jwt = require("jsonwebtoken");
require("dotenv").config(); // .env dosyasını yükle

module.exports = function (req, res, next) {
  // Header'dan token al
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "Yetkilendirme reddedildi" });
  }

  // "Bearer " kısmını temizle
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    // Token'ı doğrula
    const secretKey =
      process.env.JWT_SECRET || "666c42109ae810c5ea4f25aa149b84d5"; // .env'den al, yoksa varsayılan kullan
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Geçersiz token" });
  }
};
