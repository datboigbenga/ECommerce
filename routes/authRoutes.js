const express = require("express");
const router = express.Router();
const { regiter, login, logout} = require("../controllers/authController");

router.post("/register", regiter);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router