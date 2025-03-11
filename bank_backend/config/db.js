//MongoDB bağlantısını yönetmek için

const mongoose = require("mongoose"); //Mongoose kütüphanesini dahil ediyoruz.
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Bağlantısı Başarılı");
  } catch (error) {
    console.error("MongoDB Bağlantı Hatası:", error);
    process.exit(1);
  }
};
module.exports = connectDB;
