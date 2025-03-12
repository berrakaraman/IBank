const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Account = require("../Models/account");
const User = require("../Models/user");

// Para Yatırma (Deposit) Endpoint
router.post("/deposit", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ msg: "Yatırılacak miktar sıfırdan büyük olmalı" });
    }
    let account = await Account.findOne({ user: req.user.id });
    if (!account) {
      // Eğer hesap yoksa, oluşturuyoruz.
      account = new Account({
        user: req.user.id,
        balance: 0,
        transactions: [],
      });
    }
    account.balance += amount;
    account.transactions.push({ type: "deposit", amount });
    await account.save();
    res.json({ msg: "Para yatırma başarılı", balance: account.balance });
  } catch (error) {
    console.error("Deposit Hatası:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
});

// Para Çekme (Withdraw) Endpoint
router.post("/withdraw", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ msg: "Çekilecek miktar sıfırdan büyük olmalı" });
    }
    let account = await Account.findOne({ user: req.user.id });
    if (!account) {
      return res.status(400).json({ msg: "Hesap bulunamadı" });
    }
    if (account.balance < amount) {
      return res.status(400).json({ msg: "Yetersiz bakiye" });
    }
    account.balance -= amount;
    account.transactions.push({ type: "withdrawal", amount });
    await account.save();
    res.json({ msg: "Para çekme başarılı", balance: account.balance });
  } catch (error) {
    console.error("Withdrawal Hatası:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
});

// Kullanıcı Hesap Bilgilerini Getirme Endpoint (Opsiyonel)
router.get("/", auth, async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.user.id });
    if (!account) {
      return res.status(400).json({ msg: "Hesap bulunamadı" });
    }
    res.json(account);
  } catch (error) {
    console.error("Get Account Hatası:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
});
// EFT (Para Transferi) Endpoint
router.post("/eft", auth, async (req, res) => {
  try {
    const { amount, targetEmail } = req.body;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ msg: "Transfer edilecek miktar sıfırdan büyük olmalı" });
    }
    if (!targetEmail) {
      return res.status(400).json({ msg: "Hedef hesap bilgisi eksik" });
    }

    // Sender (gönderen) hesabını al
    let senderAccount = await Account.findOne({ user: req.user.id });
    if (!senderAccount) {
      return res.status(400).json({ msg: "Gönderen hesap bulunamadı" });
    }
    if (senderAccount.balance < amount) {
      return res.status(400).json({ msg: "Yetersiz bakiye" });
    }

    // Sender'ın bilgilerini al (not için)
    const senderUser = await User.findById(req.user.id);

    // Hedef kullanıcıyı (alıcı) email ile bul
    const recipientUser = await User.findOne({ email: targetEmail });
    if (!recipientUser) {
      return res.status(400).json({ msg: "Hedef kullanıcı bulunamadı" });
    }

    // Hedef kullanıcının hesabını al veya oluştur
    let recipientAccount = await Account.findOne({ user: recipientUser._id });
    if (!recipientAccount) {
      recipientAccount = new Account({
        user: recipientUser._id,
        balance: 0,
        transactions: [],
      });
    }

    // Gönderen hesaptan para çek ve işlemi kaydet
    senderAccount.balance -= amount;
    senderAccount.transactions.push({
      type: "withdrawal",
      amount,
      note: `EFT gönderildi to ${targetEmail}`,
    });

    // Hedef hesaba para ekle ve işlemi kaydet
    recipientAccount.balance += amount;
    recipientAccount.transactions.push({
      type: "deposit",
      amount,
      note: `EFT alındı from ${senderUser.email}`,
    });

    await senderAccount.save();
    await recipientAccount.save();

    res.json({ msg: "EFT işlemi başarılı", balance: senderAccount.balance });
  } catch (error) {
    console.error("EFT Hatası:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
});

module.exports = router;
