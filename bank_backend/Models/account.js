<<<<<<< HEAD
=======
// bank_backend/Models/account.js
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
<<<<<<< HEAD
    enum: ["deposit", "withdrawal"],
=======
    enum: ["deposit", "withdrawal", "conversion"],
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
<<<<<<< HEAD
=======

  currency: {
    type: String,
    default: "TRY",
  },
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
  note: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const AccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
<<<<<<< HEAD
  balance: {
    type: Number,
    default: 0,
=======
  balances: {
    TRY: { type: Number, default: 0 },
    USD: { type: Number, default: 0 },
    EUR: { type: Number, default: 0 },
    GBP: { type: Number, default: 0 },
    CHF: { type: Number, default: 0 },
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
  },
  transactions: [TransactionSchema],
});

module.exports = mongoose.model("Account", AccountSchema);
