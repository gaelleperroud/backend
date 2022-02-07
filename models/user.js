const mongoose = require("mongoose"); //on importe mongoose pour la bdd
const uniqueValidator = require("mongoose-unique-validator"); //on importe ceci afin de ne pouvoir créer plusieurs compte avec le meme email
const beautifyUnique = require("mongoose-beautiful-unique-validation"); //on importe ceci afin de pouvoir remonté les erreurs de la base de données

const modelUser = mongoose.Schema({
  //on crée notre modèle user
  email: {
    type: String,
    required: true,
    unique: "Cette adresse mail est déja utilisée ({VALUE})",
  }, //erreur remontée par le plugin en cas d'email deja utilisé
  password: { type: String, required: true },
});

modelUser.plugin(uniqueValidator);
modelUser.plugin(beautifyUnique);

module.exports = mongoose.model("User", modelUser); //on exporte le modèle pour s'en servir ailleurs
