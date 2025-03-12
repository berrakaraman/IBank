// src/components/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/user/login", formData);
      if (res.data.token) {
        onLogin(res.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.msg || "Giriş hatası");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Giriş</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>E-posta:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Şifre:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Giriş</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Hesabınız yok mu?{" "}
        <button onClick={() => navigate("/register")}>Kayıt Ol</button>
      </p>
    </div>
  );
};

export default Login;
