/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AccountSettings = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const fetchUserInfo = async () => {
    try {
      const res = await api.get("/api/user/me");
      setUserInfo({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
      });
    } catch (error) {
      console.error("Kullanıcı bilgileri alınırken hata:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserInfo();
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmNewPassword) {
      return setMessage("Yeni şifre ile doğrulama eşleşmiyor");
    }
    try {
      const res = await api.put("/api/user/me", {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        currentPassword,
        newPassword,
      });
      setMessage(res.data.msg);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setUserInfo(res.data.user);
    } catch (error) {
      console.error("Profil güncelleme hatası:", error);
      setMessage(
        error.response?.data?.msg || "Profil güncellenirken hata oluştu"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hesap Ayarları</h1>
      {message && <p style={{ color: "blue" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>İsim: </label>
          <input
            type="text"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>E-posta: </label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Telefon: </label>
          <input
            type="text"
            value={userInfo.phone}
            onChange={(e) =>
              setUserInfo({ ...userInfo, phone: e.target.value })
            }
          />
        </div>
        <hr />
        <h3>Şifre Değiştirme</h3>
        <div style={{ marginBottom: "10px" }}>
          <label>Mevcut Şifre: </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Yeni Şifre: </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Yeni Şifre (Tekrar): </label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <button type="submit">Güncelle</button>
      </form>
    </div>
  );
};

export default AccountSettings;
