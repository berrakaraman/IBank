// src/components/Layout/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#222",
        color: "#fff",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Link
          to="/dashboard"
          style={{ color: "#fff", textDecoration: "none", marginRight: "20px" }}
        >
          Dashboard
        </Link>

        <Link
          to="/deposit"
          style={{ color: "#fff", textDecoration: "none", marginRight: "20px" }}
        >
          Para Yatır
        </Link>

        <Link
          to="/transfer"
          style={{ color: "#fff", textDecoration: "none", marginRight: "20px" }}
        >
          EFT İşlemleri
        </Link>

        <Link
          to="/currency-exchange"
          style={{ color: "#fff", textDecoration: "none", marginRight: "20px" }}
        >
          Döviz İşlemleri
        </Link>

        <Link
          to="/investment-price"
          style={{ color: "#fff", textDecoration: "none", marginRight: "20px" }}
        >
          Varlık Fiyat Sorgula
        </Link>

        <Link
          to="/transactions"
          style={{ color: "#fff", textDecoration: "none", marginRight: "20px" }}
        >
          İşlem Geçmişi
        </Link>

        <Link
          to="/account-settings"
          style={{ color: "#fff", textDecoration: "none", marginRight: "20px" }}
        >
          Hesap Ayarları
        </Link>
      </div>
      <button
        onClick={handleLogout}
        style={{
          background: "red",
          border: "none",
          color: "#fff",
          padding: "8px 15px",
          cursor: "pointer",
        }}
      >
        Çıkış Yap
      </button>
    </nav>
  );
};

export default Navbar;
