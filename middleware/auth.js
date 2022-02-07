const jwt = require("jsonwebtoken"); //importation de jsonwebtoken

module.exports = (req, res, next) => {
  try {
    //on récupere le token via le header de la requete
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.PRIVATE_TOKEN);
    const userId = decodedToken.userId; //on le décode grace a la clé secrete
    req.auth = { userId };
    //on vérifie que l'user id récuperé via le token correspond bien a l'id de l'utilisateur
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID"; //si non on refuse la requete
    } else {
      next(); //si c'est bon on passe au middleware suivant
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"), //en cas d'erreur
    });
  }
};
