const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Format invalide.'), false);
  },
});

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucune image reçue.' });
  }

  const imagePath = req.file.path;

  try {
    // Réponses fictives pour tester l'interface
    const memesTop = [
      "QUAND TU VOIS CETTE IMAGE",
      "MOI CHAQUE MATIN",
      "PERSONNE :",
      "MON CERVEAU À 3H DU MATIN",
      "QUAND TA MÈR APPELLE",
    ];
    const memesBottom = [
      "C'EST EXACTEMENT MOI 😂",
      "ET JE COMPRENDS RIEN 💀",
      "MOI : *FAIT N'IMPORTE QUOI* 😅",
      "ON VA MANGER QUOI ? 🍗",
      "J'ARRIVE DANS 5 MINUTES 😂",
    ];

    const top = memesTop[Math.floor(Math.random() * memesTop.length)];
    const bottom = memesBottom[Math.floor(Math.random() * memesBottom.length)];

    res.status(200).json({ captionTop: top, captionBottom: bottom });

  } finally {
    try {
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    } catch (e) {}
  }
});

module.exports = router;
