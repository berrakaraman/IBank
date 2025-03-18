import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CurrencyExchange = () => {
  const navigate = useNavigate();
  const [sourceCurrency, setSourceCurrency] = useState("TRY");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleConvert = async () => {
    try {
      const res = await api.post("/api/currency/convert", {
        sourceCurrency,
        targetCurrency,
        amount: Number(amount),
      });
      setMessage(res.data.msg);
      setResult(res.data.conversion);
    } catch (error) {
      setMessage(
        error.response?.data?.msg || "Döviz işlemi sırasında hata oluştu"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Döviz Dönüşümü</h1>
      <section
        style={{
          background: "#f9f9f9",
          padding: "15px",
          border: "1px solid #ddd",
          marginBottom: "20px",
        }}
      >
        <h2>Bilgilendirme</h2>
        <p>
          Bu sayfada, istediğiniz kaynak para biriminden (örn. TRY, USD, EUR,
          vb.) istediğiniz hedef para birimine dönüşüm yapabilirsiniz. Dönüşüm
          oranı, (hedef oran / kaynak oran) şeklinde hesaplanır.
        </p>
      </section>
      <div>
        <label>Kaynak Para Birimi: </label>
        <select
          value={sourceCurrency}
          onChange={(e) => setSourceCurrency(e.target.value)}
        >
          <option value="TRY">TRY</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="CHF">CHF</option>
        </select>
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Dönüştürülecek Miktar: </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Miktar giriniz"
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Hedef Para Birimi: </label>
        <select
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
        >
          <option value="TRY">TRY</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="CHF">CHF</option>
        </select>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleConvert}>Dönüştür</button>
      </div>
      {message && <p style={{ color: "blue", marginTop: "20px" }}>{message}</p>}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <p>
            {amount} {sourceCurrency} = {result.convertedAmount.toFixed(2)}{" "}
            {targetCurrency} (Kur: {result.rate.toFixed(4)})
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyExchange;
