// bank_backend/Routes/currencyRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const axios = require("axios");
const Account = require("../Models/account");

router.post("/convert", auth, async (req, res) => {
  try {
    const { sourceCurrency, targetCurrency, amount } = req.body;
    if (!sourceCurrency || !targetCurrency || !amount || amount <= 0) {
      return res.status(400).json({ msg: "Eksik veya geçersiz bilgiler" });
    }

    const srcCurr = sourceCurrency.toUpperCase();
    const tgtCurr = targetCurrency.toUpperCase();

    let account = await Account.findOne({ user: req.user.id });
    if (!account) {
      return res.status(400).json({ msg: "Hesap bulunamadı" });
    }

    if (!account.balances[srcCurr] || account.balances[srcCurr] < amount) {
      return res.status(400).json({ msg: `Yetersiz ${srcCurr} bakiyesi` });
    }

    const response = await axios.get(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/try.json"
    );
    const conversionData = response.data;
    if (!conversionData || !conversionData.try) {
      return res.status(400).json({ msg: "Döviz verisi alınamadı" });
    }
    const rates = {};
    for (let key in conversionData.try) {
      rates[key.toUpperCase()] = conversionData.try[key];
    }

    if (!rates[srcCurr] || !rates[tgtCurr]) {
      return res.status(400).json({ msg: "Geçersiz para birimi" });
    }

    // Dönüşüm oranını hesaplama:
    // conversionRate = (rate_target / rate_source)
    const conversionRate = rates[tgtCurr] / rates[srcCurr];
    const convertedAmount = amount * conversionRate;

    account.balances[srcCurr] -= amount;
    if (!account.balances[tgtCurr]) {
      account.balances[tgtCurr] = 0;
    }
    account.balances[tgtCurr] += convertedAmount;

    account.transactions.push({
      type: "conversion",
      amount,
      currency: srcCurr,
      note: `${amount} ${srcCurr} dönüşüm yapılarak ${convertedAmount.toFixed(
        2
      )} ${tgtCurr} elde edildi (kur: ${conversionRate.toFixed(4)})`,
    });

    await account.save();

    res.json({
      msg: "Döviz işlemi başarılı",
      conversion: {
        sourceCurrency: srcCurr,
        targetCurrency: tgtCurr,
        amount,
        convertedAmount,
        rate: conversionRate,
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

module.exports = router;
