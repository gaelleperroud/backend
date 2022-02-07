const multer = require("multer"); //on importe multer

const MIME_TYPES = {
  // on crée un "dictionnaire" des extensions a utiliser
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  //on choisi la destination pour stocker les fichiers
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    //on va formater le nom du fichier
    const name = file.originalname.split(" ").join("_").split(".")[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image"); //on exporte la configuration de multer
