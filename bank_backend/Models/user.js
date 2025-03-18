const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  // müşteri, banka personeli, admin
  role: {
    type: String,
    enum: ["customer", "staff", "admin"],
    default: "customer",
  },
});

module.exports = mongoose.model("User", UserSchema, "users");
