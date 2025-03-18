/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/Deposit/Deposit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Deposit = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [balances, setBalances] = useState(null);

  // Hesap bilgilerini (çoklu para birimi) çek
  const fetchAccount = async () => {
    try {
      const res = await api.get("/api/account");
      setBalances(res.data.balances);
    } catch (error) {
      console.error("Hesap bilgisi alınırken hata:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchAccount();
    }
  }, [navigate]);

  const handleDeposit = async () => {
    try {
      const res = await api.post("/api/account/deposit", {
        amount: Number(amount),
      });
      setMessage(res.data.msg);
      setBalances(res.data.balances);
      setAmount("");
    } catch (error) {
      setMessage(
        error.response?.data?.msg || "Para yatırma sırasında hata oluştu"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Para Yatırma</h1>
      <div>
        <h2>Mevcut Bakiyeler:</h2>
        {balances ? (
          <ul>
            {Object.entries(balances).map(([currency, bal]) => (
              <li key={currency}>
                {currency}: {bal.toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          "Yükleniyor..."
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Yatırılacak Miktar (TL): </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Miktar giriniz"
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleDeposit}>Para Yatır</button>
      </div>
      {message && (
        <div style={{ marginTop: "20px", color: "blue" }}>{message}</div>
      )}
    </div>
  );
};

export default Deposit;
