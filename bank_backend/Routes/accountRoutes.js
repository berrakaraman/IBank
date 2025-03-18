// bank_backend/Routes/accountRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Account = require("../Models/account");
const User = require("../Models/user");
const axios = require("axios");

// Para Yatırma
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
      //çalışmıyor BAK!
      account = new Account({
        user: req.user.id,
        balances: { TRY: 0, USD: 0, EUR: 0, GBP: 0, CHF: 0 },
        transactions: [],
      });
    }
    //Diğer para birimlerinde para yüklemeyi getir
    account.balances.TRY += amount;
    account.transactions.push({ type: "deposit", amount, currency: "TRY" });
    await account.save();
    res.json({ msg: "Para yatırma başarılı", balances: account.balances });
  } catch (error) {
    console.error("Deposit Hatası:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
});

// Para Çekme
//web tarafına ekle bunu
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
    if (account.balances.TRY < amount) {
      return res.status(400).json({ msg: "Yetersiz bakiye" });
    }
    account.balances.TRY -= amount;
    account.transactions.push({ type: "withdrawal", amount, currency: "TRY" });
    await account.save();
    res.json({ msg: "Para çekme başarılı", balances: account.balances });
  } catch (error) {
    console.error("Withdrawal Hatası:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
});

// Kullanıcı Hesap Bilgilerini Getirme

// ADMİN ROLU İÇİN YAP
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

// EFT
router.post("/eft", auth, async (req, res) => {
  try {
    const { amount, targetEmail } = req.body;
    //kontroller
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ msg: "Transfer edilecek miktar sıfırdan büyük olmalı" });
    }
    if (!targetEmail) {
      return res.status(400).json({ msg: "Hedef hesap bilgisi eksik" });
    }

    let senderAccount = await Account.findOne({ user: req.user.id });
    //kontroller
    if (!senderAccount) {
      return res.status(400).json({ msg: "Gönderen hesap bulunamadı" });
    }
    if (senderAccount.balances.TRY < amount) {
      return res.status(400).json({ msg: "Yetersiz bakiye" });
    }

    const senderUser = await User.findById(req.user.id);
    const recipientUser = await User.findOne({ email: targetEmail });
    if (!recipientUser) {
      return res.status(400).json({ msg: "Hedef kullanıcı bulunamadı" });
    }
    let recipientAccount = await Account.findOne({ user: recipientUser._id });
    if (!recipientAccount) {
      recipientAccount = new Account({
        user: recipientUser._id,
        balances: { TRY: 0, USD: 0, EUR: 0, GBP: 0, CHF: 0 },
        transactions: [],
      });
    }

    senderAccount.balances.TRY -= amount;
    senderAccount.transactions.push({
      type: "withdrawal",
      amount,
      currency: "TRY",
      note: `EFT gönderildi to ${targetEmail}`,
    });
    recipientAccount.balances.TRY += amount;
    recipientAccount.transactions.push({
      type: "deposit",
      amount,
      currency: "TRY",
      note: `EFT alındı from ${senderUser.email}`,
    });

    await senderAccount.save();
    await recipientAccount.save();

    res.json({ msg: "EFT işlemi başarılı", balances: senderAccount.balances });
  } catch (error) {
    console.error("EFT Hatası:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
});

//bunu biraz daha düşün belki bir şey bulursun
router.post("/convert", auth, async (req, res) => {
  try {
    const { sourceCurrency, targetCurrency, amount } = req.body;
    if (!sourceCurrency || !targetCurrency || !amount || amount <= 0) {
      return res.status(400).json({ msg: "Eksik veya geçersiz bilgiler" });
    }
    if (sourceCurrency.toUpperCase() !== "TRY") {
      return res.status(400).json({ msg: "HATA" });
    }

    let account = await Account.findOne({ user: req.user.id });
    //hesap bakiye kontrolü yap
    if (!account) {
      return res.status(400).json({ msg: "Hesap bulunamadı" });
    }
    if (!account.balances["TRY"] || account.balances["TRY"] < amount) {
      return res.status(400).json({ msg: "Yetersiz TRY bakiyesi" });
    }

    const response = await axios.get(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/try.json"
    );
    const conversionData = response.data;
    if (
      !conversionData ||
      !conversionData.try ||
      !conversionData.try[targetCurrency.toLowerCase()]
    ) {
      return res
        .status(400)
        .json({ msg: "Geçersiz hedef para birimi veya API hatası" });
    }
    const rate = conversionData.try[targetCurrency.toLowerCase()];
    const convertedAmount = amount * rate;

    account.balances["TRY"] -= amount;
    //tanımsız para birimini kabul etmedi
    if (!account.balances[targetCurrency.toUpperCase()]) {
      account.balances[targetCurrency.toUpperCase()] = 0;
    }
    account.balances[targetCurrency.toUpperCase()] += convertedAmount;

    // İşlem kaydını ekle
    account.transactions.push({
      type: "conversion",
      amount,
      currency: "TRY",
      note: `${amount} TRY'den ${convertedAmount.toFixed(
        2 //ondalık sayıyı yuvarla
      )} ${targetCurrency.toUpperCase()}'ye dönüşüm (kur: ${rate})`,
    });

    await account.save();

    res.json({
      msg: "Döviz işlemi başarılı",
      conversion: {
        sourceCurrency: "TRY",
        targetCurrency: targetCurrency.toUpperCase(),
        amount,
        convertedAmount,
        rate,
      },
      balances: account.balances,
    });
  } catch (error) {
    console.error(
      "Döviz İşlemi Hatası:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ msg: "Sunucu hatası" });
  }
});

// İşlem geçmişi
router.get("/transactions", auth, async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.user.id });
    if (!account) {
      return res.status(400).json({ msg: "Hesap bulunamadı" });
    }
    // İşlemleri tarih sırasına göre sırala
    const transactions = account.transactions.sort((a, b) => b.date - a.date);
    res.json(transactions);
  } catch (error) {
    console.error("Transaction retrieval error:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
});

module.exports = router;
