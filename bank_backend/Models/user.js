const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
<<<<<<< HEAD
    unique: true, //benzersiz yaptık
=======
    unique: true,
  },
  phone: {
    type: String,
    default: "",
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
  },
  password: {
    type: String,
    required: true,
  },
<<<<<<< HEAD
=======
  // müşteri, banka personeli, admin
  role: {
    type: String,
    enum: ["customer", "staff", "admin"],
    default: "customer",
  },
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
});

module.exports = mongoose.model("User", UserSchema, "users");
