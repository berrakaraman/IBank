const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["deposit", "withdrawal"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
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
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [TransactionSchema],
});

module.exports = mongoose.model("Account", AccountSchema);
