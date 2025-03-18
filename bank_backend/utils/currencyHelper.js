// utils/currencyHelper.js
const axios = require("axios");

async function getExchangeRates() {
  try {
    const response = await axios.get(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/try.json"
    );
    const conversionData = response.data;
    if (!conversionData || !conversionData.try) {
      throw new Error("Döviz verisi alınamadı.");
    }
    const rates = {};
    for (let key in conversionData.try) {
      rates[key.toUpperCase()] = conversionData.try[key];
    }
    return rates;
  } catch (error) {
    console.error("Döviz API hatası:", error.message);
    throw error;
  }
}

module.exports = { getExchangeRates };
