const bcrypt = require("bcrypt"); //on importe bcrypt afin de crypter le mdp
const User = require("../models/user"); //on importe notre modèle User
const jwt = require("jsonwebtoken"); //on importe jsonxebtoken afin de créer des tokens d'authentifications
const dotenv = require("dotenv"); //on importe dotenv afin d'utiliser des variables d'environnement
dotenv.config();

//pour créer son compte
exports.signup = (req, res, next) => {
  bcrypt //on va crypter le mot de passe en le passant 10 fois dans l'algorythme de cryptage
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        //on crée un nouvel utilisateur avec l'email et le mdp crypté
        email: req.body.email,
        password: hash,
      });
      user
        .save() //on sauvegarde dans la bdd
        .then(() => res.status(201).json({ message: "Utilisateur créé !" })) // réponse du serveur
        .catch((error) => res.status(400).json({ error })); //erreur
    })
    .catch((error) => res.status(500).json({ error })); //erreur
};

//pour se connecter
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) //on cherche l'email de l'user dans la bdd
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" }); //si on ne le trouve pas
      }
      bcrypt
        .compare(req.body.password, user.password) //on compare le hash du mdp a celui de la bdd
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" }); //en cas de mauvais mdp
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.PRIVATE_TOKEN, {
              expiresIn: "24h",
            }), //si on a bien trouvé l'user on lui assigne un token qui va durer 24h qu'on va crypter
          }); // grace à notre clé secrete qu'on va récuperer grace aux variables d'environnement
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
