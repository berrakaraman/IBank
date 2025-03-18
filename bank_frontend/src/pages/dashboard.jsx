/* eslint-disable react-hooks/exhaustive-deps */
<<<<<<< HEAD
=======
// src/pages/Dashboard/Dashboard.jsx
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const [balance, setBalance] = useState(null);
=======
  const [balances, setBalances] = useState(null);
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
  const [showEFTForm, setShowEFTForm] = useState(false);
  const [eftTargetEmail, setEftTargetEmail] = useState("");
  const [eftAmount, setEftAmount] = useState("");
  const [message, setMessage] = useState("");

<<<<<<< HEAD
  // Hesap bilgilerini çekmek
  const fetchAccount = async () => {
    try {
      const res = await api.get("/api/account");
      setBalance(res.data.balance);
    } catch (error) {
      console.error("Hesap bilgisi alınırken hata:", error);
      if (error.response && error.response.status === 401) {
=======
  const fetchAccount = async () => {
    try {
      const res = await api.get("/api/account");
      setBalances(res.data.balances);
    } catch (error) {
      console.error("Hesap bilgisi alınırken hata:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
        navigate("/login");
      }
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    // Token kontrolü: Giriş yapılmamışsa login sayfasına yönlendir
=======
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchAccount();
    }
  }, [navigate]);

<<<<<<< HEAD
  // EFT işlemini gerçekleştiren fonksiyon
=======
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
  const handleEFT = async () => {
    try {
      const res = await api.post("/api/account/eft", {
        targetEmail: eftTargetEmail,
        amount: Number(eftAmount),
      });
      setMessage(res.data.msg);
<<<<<<< HEAD
      setBalance(res.data.balance);
      // Form alanlarını temizle
=======
      setBalances(res.data.balances);
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
      setEftTargetEmail("");
      setEftAmount("");
      setShowEFTForm(false);
    } catch (error) {
      setMessage(
        error.response?.data?.msg || "EFT işlemi sırasında hata oluştu"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <div>
<<<<<<< HEAD
        <h2>Mevcut Bakiye: {balance !== null ? balance : "Yükleniyor..."}</h2>
      </div>

      {/* EFT İşlemi Formu için buton */}
=======
        <h2>Mevcut Bakiyeler:</h2>
        {balances ? (
          <ul>
            {Object.entries(balances).map(([currency, amount]) => (
              <li key={currency}>
                {currency}: {amount.toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          "Yükleniyor..."
        )}
      </div>
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setShowEFTForm(!showEFTForm)}>
          {showEFTForm ? "EFT Formunu Kapat" : "EFT İşlemi Yap"}
        </button>
      </div>
<<<<<<< HEAD

      {/* EFT Formu */}
=======
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
      {showEFTForm && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "10px",
            maxWidth: "400px",
          }}
        >
          <h3>EFT İşlemi</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>Hedef E-Posta: </label>
            <input
              type="email"
              value={eftTargetEmail}
              onChange={(e) => setEftTargetEmail(e.target.value)}
              placeholder="hedef@example.com"
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
<<<<<<< HEAD
            <label>Miktar: </label>
=======
            <label>Miktar (TL): </label>
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
            <input
              type="number"
              value={eftAmount}
              onChange={(e) => setEftAmount(e.target.value)}
              placeholder="Miktar giriniz"
            />
          </div>
          <div>
            <button onClick={handleEFT}>EFT Yap</button>
          </div>
          {message && (
            <div style={{ marginTop: "10px", color: "blue" }}>{message}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
