const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Aucun fichier audio reçu"
      });
    }

    return res.status(200).json({
      message: "Audio reçu avec succès",
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    console.error("Erreur voice-to-meme :", error);
    return res.status(500).json({
      error: "Erreur serveur lors du traitement audio"
    });
  }
});

module.exports = router;