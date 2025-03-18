const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["deposit", "withdrawal", "conversion"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },

  currency: {
    type: String,
    default: "TRY",
  },
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
  balances: {
    TRY: { type: Number, default: 0 },
    USD: { type: Number, default: 0 },
    EUR: { type: Number, default: 0 },
    GBP: { type: Number, default: 0 },
    CHF: { type: Number, default: 0 },
  },
  transactions: [TransactionSchema],
});

module.exports = mongoose.model("Account", AccountSchema);
