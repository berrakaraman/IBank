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
          to="/transfer"
          style={{ color: "#fff", textDecoration: "none", marginRight: "20px" }}
        >
          EFT İşlemleri
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
