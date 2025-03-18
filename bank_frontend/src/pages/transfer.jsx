/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Transfer = () => {
  const navigate = useNavigate();
  const [targetEmail, setTargetEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [balances, setBalances] = useState(null);

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

      setBalances(res.data.balances);
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

      setBalances(res.data.balances);
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
        <label>Miktar (TL): </label>
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
