/**
 * Point d'entrée principal du serveur Backend pour MemeMixAI
 * Initialise Express, configure les middlewares globaux (CORS, JSON Parser)
 * et connecte les différentes routes de l'application.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de sécurité et d'accès cross-origin (CORS)
app.use(cors());

// Middleware pour parser les requêtes au format JSON
app.use(express.json());

// Importation des routes
const contextReaderRoutes = require('./routes/contextReader');
const voiceToMemeRoutes = require('./routes/voiceToMeme');

// Enregistrement des routes de l'API
app.use('/api/context-reader', contextReaderRoutes);
app.use('/api/voice-to-meme', voiceToMemeRoutes);

// Route de diagnostic simple (Health Check)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MemeMixAI Backend est opérationnel !' });
});

// Lancement du serveur d'écoute
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Serveur démarré sur : http://localhost:${PORT}`);
  console.log(`📂 Route disponible : http://localhost:${PORT}/api/context-reader`);
  console.log(`===================================================`);
});
