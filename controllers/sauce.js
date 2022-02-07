const Sauce = require("../models/sauce"); //on importe notre modele Sauce
const fs = require("fs"); //on importe fs afin de pouvoir modifier les images

//pour créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); //on récuper les données de la requete
  delete sauceObject._id; //on enlev l'id de la sauce car mongoose crée son propre id
  const sauce = new Sauce({
    //on crée une nouvelle sauce avec "new"
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      //pour créer l'url de l'image
      req.file.filename
    }`,
    likes: 0, //on crée ces données qui n'était pas dans la requete
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save() //puis on sauvegarde la nouvelle sauce dans la bdd
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" })) //renvoie réponse serveur code 200
    .catch((error) => res.status(400).json({ error })); //en cas d'errueur
};

//pour trouver une sauce avec son id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //on récupere l'id dans le parametre de la requete
    .then((sauce) => res.status(200).json(sauce)) //on renvoie la sauce ainsi que le code 200
    .catch((error) => res.status(404).json({ error })); //en cas d'erreur
};

//pour modifier la sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        //dans le cas de l'ajout d'une nouvelle image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }; //dans le cas de la modification sans image
  Sauce.updateOne(
    //updateOne sert a modifier
    { _id: req.params.id }, //on précise quelle sauce on modifie
    { ...sauceObject, _id: req.params.id } //on remplace par notre objet
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" })) //renvoie de la réponse serveur
    .catch((error) => res.status(400).json({ error })); //en cas d'erreur
};

//pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //on cherche notre sauce grace au parametre de la requete
    .then((sauce) => {
      if (!sauce) {
        //dans le cas où l'id n'existe pas dans la bdd
        res.status(404).json({
          error: new Error("Cette sauce n'existe pas!"),
        });
      }
      if (sauce.userId !== req.auth.userId) {
        //on vérifie l'id user afin que seul ce propriétaire de la sauce puisse la supprimer
        res.status(403).json({
          error: new Error("unauthorized request!"),
        });
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        //pour suprimmer l'image de la bdd
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "sauce supprimée !" })) //on retourne un code 200
          .catch((error) => res.status(400).json({ error })); //en cas d'erreur
      });
    })
    .catch((error) => res.status(500).json({ error })); //en cas d'erreur sur la promesse
};

//pour avoir la liste de toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces)) //retourne le code de succès de la requete
    .catch((error) => res.status(400).json({ error })); //en cas d'erreur
};
