/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/AccountOperations.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AccountOperations = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchAccount();
    }
  }, [navigate]);

  const fetchAccount = async () => {
    try {
      const res = await api.get("/api/account");
      setBalance(res.data.balance);
    } catch (error) {
      console.error("Hesap bilgisi alınırken hata:", error);

      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleDeposit = async () => {
    try {
      const res = await api.post("/api/account/deposit", {
        amount: Number(amount),
      });
      setMessage(res.data.msg);
      setBalance(res.data.balance);
      setAmount("");
    } catch (error) {
      setMessage(
        error.response?.data?.msg || "Para yatırma sırasında hata oluştu"
      );
    }
  };

  const handleWithdraw = async () => {
    try {
      const res = await api.post("/api/account/withdraw", {
        amount: Number(amount),
      });
      setMessage(res.data.msg);
      setBalance(res.data.balance);
      setAmount("");
    } catch (error) {
      setMessage(
        error.response?.data?.msg || "Para çekme sırasında hata oluştu"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Para İşlemleri</h2>
      <div>
        <strong>Mevcut Bakiye: </strong>
        <span>{balance !== null ? balance : "Yükleniyor..."}</span>
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Miktar: </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleDeposit}>Para Yatır</button>
        <button onClick={handleWithdraw} style={{ marginLeft: "10px" }}>
          Para Çek
        </button>
      </div>
      {message && (
        <div style={{ marginTop: "20px", color: "blue" }}>{message}</div>
      )}
    </div>
  );
};

export default AccountOperations;
