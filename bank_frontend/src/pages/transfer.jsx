/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Transfer = () => {
  const navigate = useNavigate();
  const [targetEmail, setTargetEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(null);

  // Eğer token yoksa kullanıcıyı login sayfasına yönlendir
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

  const handleTransfer = async () => {
    try {
      const res = await api.post("/api/account/eft", {
        targetEmail,
        amount: Number(amount),
      });
      setMessage(res.data.msg);
      setBalance(res.data.balance);
      setTargetEmail("");
      setAmount("");
    } catch (error) {
      setMessage(
        error.response?.data?.msg || "EFT işlemi sırasında hata oluştu"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>EFT İşlemi</h2>
      <div>
        <strong>Mevcut Bakiye: </strong>
        <span>{balance !== null ? balance : "Yükleniyor..."}</span>
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Hedef E-Posta: </label>
        <input
          type="email"
          value={targetEmail}
          onChange={(e) => setTargetEmail(e.target.value)}
        />
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
        <button onClick={handleTransfer}>EFT Yap</button>
      </div>
      {message && (
        <div style={{ marginTop: "20px", color: "blue" }}>{message}</div>
      )}
    </div>
  );
};

export default Transfer;
