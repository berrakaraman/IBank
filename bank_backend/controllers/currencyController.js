// controllers/currencyController.js
const Account = require("../models/account");
const { getExchangeRates } = require("../utils/currencyHelper");

exports.convert = async (req, res) => {
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
    const rates = await getExchangeRates();
    if (!rates[srcCurr] || !rates[tgtCurr]) {
      return res.status(400).json({ msg: "Geçersiz para birimi" });
    }
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
    console.error("Döviz İşlemi Hatası:", error.message);
    res.status(500).json({ msg: "Sunucu hatası" });
  }
};
