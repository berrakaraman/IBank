const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator"); //form verilerini kontrol
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

    user = new User({ name, email, password: hashedPassword });

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

// 🟢 Kullanıcı Girişi (Login)
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
      // Kullanıcıyı email ile bul
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Geçersiz kimlik bilgileri" });
      }

      // Şifreyi karşılaştır
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Geçersiz kimlik bilgileri" });
      }

      // JWT Token oluştur
      const payload = {
        user: {
          id: user.id,
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

// 🟢 Kullanıcı Bilgilerini Getirme (Auth Gerekli)
router.get("/me", auth, async (req, res) => {
  try {
    // Kullanıcıyı ID'ye göre getir, ama şifreyi gösterme
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
});

module.exports = router;
