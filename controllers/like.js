const Sauce = require("../models/sauce");//on importe le modele Sauce

exports.like = async (req, res, next) => {//on exporte notre controlleur afin de l'utiliser dans notre route
  try {
    //on va chercher dans la bdd la sauce avec l'id passé en parametre de la requete ET si l'id user est dans le tableau des likes:
    const resultLike = await Sauce.find({
      _id: req.params.id,
      usersLiked: req.body.userId,
    });
    //on va chercher dans la bdd la sauce avec l'id passé en parametre de la requete ET si l'id user est dans le tableau des dislikes:
    const resultDislike = await Sauce.find({
      _id: req.params.id,
      usersDisliked: req.body.userId,
    });
    //si aucun résultat n'est retourné dans les deux recherches:
    if (resultLike.length == 0 && resultDislike.length == 0) {
      console.log("sauce non liké et non disliké");
      const sauce = await Sauce.find({ _id: req.params.id });
      if (sauce.length == 0) {
        //on vérifie que la sauce existe bien
        res.status(404).json({ message: "Cette sauce n'existe pas !" });
      } else {
        if (req.body.like == 1) {
          //si l'utilisateur like la sauce on utilise notre fonction like
          try {
            likeSauce(req, res);
          } catch (error) {
            //en cas d'erreur
            res.status(500).json({ error });
          }
        } else if (req.body.like == -1) {
          //si l'utilisateur dislike la sauce on va utiliser notrer fonction dislike
          try {
            dislikeSauce(req, res);
          } catch (error) {
            //en cas d'erreur du try
            res.status(500).json({ error });
          }
        } else if (req.body.like == 0) {
          // si l'utilisateur envoie 0("unlike" ou "undislike") alors on aura une erreur
          res.status(400).json({ message: "requete impossible" });
        } else {
          //pour éviter une requete avec un mauvais code
          res.status(400).json({ message: "requete impossible" });
        }
      }
    } else if (resultLike.length == 0 && resultDislike !== 0) {
      //pas de resultat pour les like mais un résultat pour
      console.log("sauce non liké et disliké"); //les dislikes =>l'utilisateur a déja disliké la sauce
      if (req.body.like == 1) {
        //on empeche l'utilisateur de liker car il dislike déja
        res
          .status(400)
          .json({
            message: "Vous devez enlever votre dislike pour liker la sauce !",
          });
      } else if (req.body.like == -1) {
        //on l'empeche de disliker encore une fois
        res.status(400).json({ message: "Vous avez déja disliké la sauce !" });
      } else if (req.body.like == 0) {
        try {
          //on utilise la fonction undislike afin d'enlever son dislike
          undislike(req, res);
        } catch (error) {
          //en cas d'erreur du try
          res.status(500).json({ error });
        }
      } else {
        //pour éviter une requete avec un mauvais code
        res.status(400).json({ message: "requete impossible" });
      }
    } else if (resultLike.length !== 0 && resultDislike == 0) {
      //résultat pour les likes et pas pour les dislikes
      console.log("sauce liké et non disliké"); //donc l'utilisateur like la sauce
      if (req.body.like == 1) {
        //on l'empeche de liker une deuxieme fois
        res.status(400).json({ message: "Vous avez déja liké la sauce !" });
      } else if (req.body.like == -1) {
        //on l'empeche de disliker alors qu'il like déja la sauce
        res
          .status(400)
          .json({
            message: "Vous devez enlever votre like pour disliker la sauce !",
          });
      } else if (req.body.like == 0) {
        try {
          //on utilise la fonction unlike afin d'enlever le like
          unlike(req, res);
        } catch (error) {
          //en cas d'erreur dans le bloc try
          res.status(500).json({ error });
        }
      } else {
        //pour éviter une requete avec un mauvais code
        res.status(400).json({ message: "requete impossible" });
      }
    } else {
      //en cas d'erreur
      res.status(500).json({ error });
    }
  } catch (error) {
    //en cas d'erreur dans notre bloc try
    res.status(500).json({ error });
  }
};

//la fonction like permet de modifier dans la bdd la sauce selectionnée en ajoutant 1 dans le total des likes
//et en ajoutant l'id user dans le tableau des likes, on renvoie ensuite la réponse 200
async function likeSauce(req, res) {
  const resultSauceUpdate = await Sauce.updateOne(
    { _id: req.params.id },
    { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
  );
  console.log(resultSauceUpdate);
  res.status(200).json({ message: "Votre like est enregistré !" });
}

//la fonction dislike permet de modifier dans la bdd la sauce selectionnée en ajoutant 1 dans le total des dislikes
//et en ajoutant l'id user dans le tableau des dislikes, on renvoie ensuite la réponse 200
async function dislikeSauce(req, res) {
  const resultSauceUpdate = await Sauce.updateOne(
    { _id: req.params.id },
    { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
  );
  console.log(resultSauceUpdate);
  res.status(200).json({ message: "Votre dislike est enregistré !" });
}

//la fonction undislike permet de modifier dans la bdd la sauce en enlevant 1 du total des dislike et
//en enlevant l'id user du tableau des dislikes, on renvoit la réponse du serveur code 200
async function undislike(req, res) {
  const resultSauceUpdate = await Sauce.updateOne(
    { _id: req.params.id },
    { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
  );
  console.log(resultSauceUpdate);
  res.status(200).json({ message: "Votre dislike a été enlevé !" });
}

//la fonction unlike permet de modifier dans la bdd la sauce en enlevant 1 du total des like et
//en enlevant l'id user du tableau des likes, on renvoit la réponse du serveur code 200
async function unlike(req, res) {
  const resultSauceUpdate = await Sauce.updateOne(
    { _id: req.params.id },
    { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
  );
  console.log(resultSauceUpdate);
  res.status(200).json({ message: "Votre like a été enlevé !" });
}
