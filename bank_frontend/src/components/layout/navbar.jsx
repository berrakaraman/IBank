// src/components/Layout/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/">Ana Sayfa</Link>{" "}
      {token ? (
        <>
          <Link to="/dashboard">Dashboard</Link>{" "}
          <button onClick={handleLogout}>Çıkış Yap</button>
        </>
      ) : (
        <>
          <Link to="/login">Giriş</Link> <Link to="/register">Kayıt Ol</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
