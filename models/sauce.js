const mongoose = require("mongoose"); //on importe mongoose: notre bdd

const modelSauce = mongoose.Schema({
  //on crée un modéle avec les differents parametres qu'on veur pour nos sauces
  name: { type: String, required: true }, //le type string correspond a une chaine de caracteres
  manufacturer: { type: String, required: true }, //required:true est l'obligation de remplir ce champs
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true }, //le type number correspond a des nombres
  userId: { type: String, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: Array, required: true }, //le type array correspond a un tablea
  usersDisliked: { type: Array, required: true },
});

module.exports = mongoose.model("Sauce", modelSauce); //on exporte le modèle qu'on réutilisera ailleurs
