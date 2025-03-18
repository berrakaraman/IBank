// controllers/accountController.js
const Account = require("../models/account");
const User = require("../models/user");

exports.deposit = async (req, res) => {
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
    //Diğer para birimlerinde para yüklemeyi getir?
    account.balances.TRY += amount;
    account.transactions.push({ type: "deposit", amount, currency: "TRY" });
    await account.save();
    res.json({ msg: "Para yatırma başarılı", balances: account.balances });
  } catch (error) {
    console.error("Deposit Hatası:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
};

//web tarafına ekle bunu?
exports.withdraw = async (req, res) => {
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
};

//Admin Rolü için dene?
exports.getAccount = async (req, res) => {
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
};

exports.eft = async (req, res) => {
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
    let senderAccount = await Account.findOne({ user: req.user.id });
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
};

exports.getTransactions = async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.user.id });
    if (!account) {
      return res.status(400).json({ msg: "Hesap bulunamadı" });
    }
    const transactions = account.transactions.sort((a, b) => b.date - a.date);
    res.json(transactions);
  } catch (error) {
    console.error("Transaction retrieval error:", error);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
};
