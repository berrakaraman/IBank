/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [showEFTForm, setShowEFTForm] = useState(false);
  const [eftTargetEmail, setEftTargetEmail] = useState("");
  const [eftAmount, setEftAmount] = useState("");
  const [message, setMessage] = useState("");

  // Hesap bilgilerini çekmek
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

  useEffect(() => {
    // Token kontrolü: Giriş yapılmamışsa login sayfasına yönlendir
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchAccount();
    }
  }, [navigate]);

  // EFT işlemini gerçekleştiren fonksiyon
  const handleEFT = async () => {
    try {
      const res = await api.post("/api/account/eft", {
        targetEmail: eftTargetEmail,
        amount: Number(eftAmount),
      });
      setMessage(res.data.msg);
      setBalance(res.data.balance);
      // Form alanlarını temizle
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
        <h2>Mevcut Bakiye: {balance !== null ? balance : "Yükleniyor..."}</h2>
      </div>

      {/* EFT İşlemi Formu için buton */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setShowEFTForm(!showEFTForm)}>
          {showEFTForm ? "EFT Formunu Kapat" : "EFT İşlemi Yap"}
        </button>
      </div>

      {/* EFT Formu */}
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
            <label>Miktar: </label>
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
