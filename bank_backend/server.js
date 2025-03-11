require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");

connectDB();

const app = express(); //app nesnesi Express uygulamamızı temsil eder.
app.use(express.json()); //JSON formatındaki istekleri okumayı aktifleştiriyoruz.

// Burada ortam değişkenini okuyup CORS ayarını uyguluyoruz
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000", // İsterseniz '*' ile tamamen açık bırakabilirsiniz
  credentials: true,
};
app.use(cors(corsOptions));

//////////
const userRoutes = require("./Routes/userRoutes");
app.use("/api/user", userRoutes);
/////////

app.get("/", (req, res) => {
  res.send("Bank API Çalışıyor!");
});

const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bank";

console.log("sever çalışıyooorr.");
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor...`));
