/**
 * Routeur pour la fonctionnalité Voice to Meme
 * Gère le endpoint /api/voice-to-meme
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const voiceToMemeController = require('../controllers/voiceToMemeController');

// Configuration de multer pour le stockage temporaire des fichiers audio
const upload = multer({ dest: 'uploads/' });

// Route POST principale pour traiter l'audio et générer un mème
router.post('/', upload.single('audio'), voiceToMemeController.processVoiceToMeme);

module.exports = router;
