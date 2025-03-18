/* eslint-disable react-hooks/exhaustive-deps */
<<<<<<< HEAD
=======
// src/pages/Transfer/Transfer.jsx
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Transfer = () => {
  const navigate = useNavigate();
  const [targetEmail, setTargetEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
<<<<<<< HEAD
  const [balance, setBalance] = useState(null);

  // Eğer token yoksa kullanıcıyı login sayfasına yönlendir
=======
  const [balances, setBalances] = useState(null);

>>>>>>> c6c4b34 (döviz işlemleri eklendi)
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
<<<<<<< HEAD
      setBalance(res.data.balance);
=======
      setBalances(res.data.balances);
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
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
<<<<<<< HEAD
      setBalance(res.data.balance);
=======
      setBalances(res.data.balances);
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
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
<<<<<<< HEAD
        <strong>Mevcut Bakiye: </strong>
        <span>{balance !== null ? balance : "Yükleniyor..."}</span>
=======
        <strong>Mevcut Bakiyeler: </strong>
        {balances ? (
          <ul>
            {Object.entries(balances).map(([currency, amt]) => (
              <li key={currency}>
                {currency}: {amt.toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          "Yükleniyor..."
        )}
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
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
<<<<<<< HEAD
        <label>Miktar: </label>
=======
        <label>Miktar (TL): </label>
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
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
