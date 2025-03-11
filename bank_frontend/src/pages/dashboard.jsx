// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/user/me");
        setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Hoş geldin, {user.name}!</p>
      <p>E-posta: {user.email}</p>
    </div>
  );
};

export default Dashboard;
