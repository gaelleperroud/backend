const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user"); //controlleur user

router.post("/auth/signup", userCtrl.signup); //chemin + controlleur
router.post("/auth/login", userCtrl.login);

module.exports = router; //on exporte pour s'en servir dans app.js
