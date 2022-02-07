const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet"); //augmente la sécurité
const rateLimit = require("express-rate-limit"); //augmente la sécurité

const sauceRoutes = require("./routes/sauce"); //on importe nos routes
const userRoutes = require("./routes/user");
const likeRoutes = require("./routes/like");

const app = express(); //on utilise express

mongoose //config de la bdd
  .connect(process.env.DATABASE_ADDRESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  //autoriser cors origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//rateLimit sert a limiter le nombre de tentatives de connexions par adresse ip afin d'éviter les attaques par force brute
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // on limite a 15 min
  max: 100, // on limite a 100 tentatives par adresse ip pour la fenetre (ici 15min)
  standardHeaders: true, // retourne les infos dans le header rateLimit
  legacyHeaders: false,
});

app.use(helmet()); //on utilise helmet pour augmenter la sécurité
app.use(limiter); //on utilise rateLimit qu'on a configuré avant

app.use("/images", express.static(path.join(__dirname, "images"))); //pour les images

app.use("/api", sauceRoutes); //le début de l'adresse de nos routes + nos rourtes
app.use("/api", userRoutes);
app.use("/api", likeRoutes);

module.exports = app; //on exporte notre fichier
