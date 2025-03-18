// routes/accountRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const accountController = require("../controllers/accountController");

router.post("/deposit", auth, accountController.deposit);
router.post("/withdraw", auth, accountController.withdraw);
router.get("/", auth, accountController.getAccount);
router.post("/eft", auth, accountController.eft);
router.get("/transactions", auth, accountController.getTransactions);

module.exports = router;
