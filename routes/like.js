const express = require("express"); //on importe express
const router = express.Router(); //on imorte le router d'express

const auth = require("../middleware/auth"); //on importe notre middleware d'authentification
const likeCtrl = require("../controllers/like"); //on importe le controlleur des likes

router.post("/sauces/:id/like", auth, likeCtrl.like); //on crée notre route avec le chemin de la route plus les middlewares

module.exports = router; //on exporte notre routeur
