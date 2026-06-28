const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Texte vide.' });
  }

  // Réponses fictives pour tester l'interface
  const memes = [
    "QUAND TU RÉVISES TOUTE LA NUIT MAIS L'EXAM C'EST DEMAIN 😂",
    "MOI AU DÉBUT DU MOIS VS MOI À LA FIN DU MOIS 💀",
    "QUAND TA MÈRE DIT QUE LE REPAS EST PRÊT MAIS C'EST PAS ENCORE CUIT 😅",
    "QUAND TU ENVOIES UN MESSAGE ET L'AUTRE VU SANS RÉPONDRE 🙃",
    "MOI QUI EXPLIQUE MES PROBLÈMES À MA MÈRE ET ELLE COMMENCE À PRIER 🙏",
  ];

  const randomMeme = memes[Math.floor(Math.random() * memes.length)];

  res.status(200).json({ caption: randomMeme });
});

module.exports = router;
