// src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Dashboard from "./pages/dashboard";
import Transfer from "./pages/transfer";
import AccountOperations from "./pages/AccountOperations";
//import NotFound from "./pages/NotFound/NotFound";
import Navbar from "./components/layout/navbar";

import Deposit from "./pages/deposit";
import TransactionHistory from "./pages/TransactionHistory";
import AccountSettings from "./pages/AccountSettings";
import CurrencyExchange from "./pages/CurrencyExchange";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {/* Kullanıcı giriş yaptıysa Navbar'ı göster */}
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/transfer"
          element={isAuthenticated ? <Transfer /> : <Navigate to="/login" />}
        />
        <Route
          path="/account-ops"
          element={
            isAuthenticated ? <AccountOperations /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/deposit"
          element={isAuthenticated ? <Deposit /> : <Navigate to="/login" />}
        />
        <Route
          path="/transactions"
          element={
            isAuthenticated ? <TransactionHistory /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/account-settings"
          element={
            isAuthenticated ? <AccountSettings /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/currency-exchange"
          element={
            isAuthenticated ? <CurrencyExchange /> : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
