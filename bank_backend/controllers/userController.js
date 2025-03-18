// controllers/userController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      console.log("Bu e-posta zaten kayıtlı:", email);
      return res.status(400).json({ msg: "Bu e-posta zaten kayıtlı" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, phone, password: hashedPassword });
    await user.save();
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "666c42109ae810c5ea4f25aa149b84d5",
      { expiresIn: "1h" }
    );
    res.json({ token, msg: "Kullanıcı başarıyla kaydedildi!" });
  } catch (err) {
    console.error("Register Hatası:", err.message);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Geçersiz kimlik bilgileri" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Geçersiz kimlik bilgileri" });
    }
    const payload = {
      user: { id: user.id, role: user.role },
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
    console.error("Login Hatası:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Get Me Hatası:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
};

exports.updateProfile = async (req, res) => {
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
};
