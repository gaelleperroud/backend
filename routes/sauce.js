const express = require("express"); //on importe nos plugins
const router = express.Router();

const auth = require("../middleware/auth"); //on importe nos middlewares
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauce"); //on importe les controllers

router.get("/sauces/", auth, sauceCtrl.getAllSauces); //la route comprend le chemin, le midddleware d'authentification puis le controlleur
router.post("/sauces/", auth, multer, sauceCtrl.createSauce); //ici on rajoute multer car on va manipuler des images
router.get("/sauces/:id", auth, sauceCtrl.getOneSauce); //ici le chemin de la route contient l'id de la sauce
router.put("/sauces/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/sauces/:id", auth, sauceCtrl.deleteSauce);

module.exports = router; //on exporte nos routes
