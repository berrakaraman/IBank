require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");

<<<<<<< HEAD
connectDB();

const app = express(); //app nesnesi Express uygulamamızı temsil eder.
app.use(express.json()); //JSON formatındaki istekleri okumayı aktifleştiriyoruz.

// Burada ortam değişkenini okuyup CORS ayarını uyguluyoruz
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000", // İsterseniz '*' ile tamamen açık bırakabilirsiniz
=======
const userRoutes = require("./Routes/userRoutes");
const accountRoutes = require("./Routes/accountRoutes");
const currencyRoutes = require("./Routes/currencyRoutes");

connectDB();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
  credentials: true,
};
app.use(cors(corsOptions));

<<<<<<< HEAD
//
const userRoutes = require("./Routes/userRoutes");
app.use("/api/user", userRoutes);
// Yeni Account (para işlemleri) route’u
const accountRoutes = require("./Routes/accountRoutes");
app.use("/api/account", accountRoutes);
=======
app.use("/api/user", userRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/currency", currencyRoutes);
>>>>>>> c6c4b34 (döviz işlemleri eklendi)

app.get("/", (req, res) => {
  res.send("Bank API Çalışıyor!");
});

const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bank";

console.log("sever çalışıyooorr.");
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor...`));
