<<<<<<< HEAD
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator"); //form verilerini kontrol
=======
//bank_backend/Routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
const User = require("../Models/user");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      console.log("Bu e-posta zaten kayıtlı:", email);
      return res.status(400).json({ msg: "Bu e-posta zaten kayıtlı" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

<<<<<<< HEAD
    user = new User({ name, email, password: hashedPassword });
=======
    user = new User({ name, email, phone, password: hashedPassword });
>>>>>>> c6c4b34 (döviz işlemleri eklendi)

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "666c42109ae810c5ea4f25aa149b84d5",
      { expiresIn: "1h" }
    );

    res.json({ token, msg: "Kullanıcı başarıyla kaydedildi!" });
  } catch (err) {
    console.error("Hata:", err.message);
    res.status(500).send("Sunucu hatası");
  }
});

<<<<<<< HEAD
// 🟢 Kullanıcı Girişi (Login)
=======
// Kullanıcı Girişi
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Geçerli bir email girin"),
    body("password").notEmpty().withMessage("Şifre gereklidir"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
<<<<<<< HEAD
      // Kullanıcıyı email ile bul
=======
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Geçersiz kimlik bilgileri" });
      }
<<<<<<< HEAD

      // Şifreyi karşılaştır
=======
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Geçersiz kimlik bilgileri" });
      }
<<<<<<< HEAD

      // JWT Token oluştur
      const payload = {
        user: {
          id: user.id,
=======
      const payload = {
        user: {
          id: user.id,
          role: user.role,
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || "666c42109ae810c5ea4f25aa149b84d5",
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Sunucu hatası" });
    }
  }
);

<<<<<<< HEAD
// 🟢 Kullanıcı Bilgilerini Getirme (Auth Gerekli)
router.get("/me", auth, async (req, res) => {
  try {
    // Kullanıcıyı ID'ye göre getir, ama şifreyi gösterme
=======
//  Kullanıcı Bilgilerini getir
router.get("/me", auth, async (req, res) => {
  try {
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
});

<<<<<<< HEAD
=======
// Profil güncelleme ve şifre değiştirme
router.put("/me", auth, async (req, res) => {
  try {
    const { name, email, phone, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "Kullanıcı bulunamadı" });

    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ msg: "Mevcut şifrenizi girmeniz gerekiyor" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Mevcut şifreniz hatalı" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Diğer bilgileri güncelle
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();
    res.json({
      msg: "Profil güncellendi",
      user: { name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
});

>>>>>>> c6c4b34 (döviz işlemleri eklendi)
module.exports = router;
