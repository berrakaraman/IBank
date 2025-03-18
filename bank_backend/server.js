// server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const accountRoutes = require("./routes/accountRoutes");
const currencyRoutes = require("./routes/currencyRoutes");

connectDB();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/user", userRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/currency", currencyRoutes);

app.get("/", (req, res) => {
  res.send("Bank API Çalışıyor!");
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor...`));
