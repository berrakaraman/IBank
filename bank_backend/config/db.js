<<<<<<< HEAD
//MongoDB bağlantısını yönetmek için

const mongoose = require("mongoose"); //Mongoose kütüphanesini dahil ediyoruz.
=======
//MongoDB bağlantısı
const mongoose = require("mongoose");
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
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
