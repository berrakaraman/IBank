/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/api/account/transactions");
      setTransactions(res.data);
      setLoading(false);
    } catch (error) {
      console.error("İşlem geçmişi alınırken hata:", error);
      setErrorMessage(
        error.response?.data?.msg || "İşlem geçmişi alınırken hata oluştu"
      );
      setLoading(false);
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
      fetchTransactions();
    }
  }, [navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>İşlem Geçmişi</h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : errorMessage ? (
        <p style={{ color: "red" }}>{errorMessage}</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Tip</th>
              <th>Miktar</th>
              <th>Para Birimi</th>
              <th>Not</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{new Date(tx.date).toLocaleString()}</td>
                <td>{tx.type}</td>
                <td>{tx.amount}</td>
                <td>{tx.currency}</td>
                <td>{tx.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionHistory;
