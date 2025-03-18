// routes/currencyRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const currencyController = require("../controllers/currencyController");

router.post("/convert", auth, currencyController.convert);

module.exports = router;
