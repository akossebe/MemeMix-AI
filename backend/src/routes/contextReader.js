/**
 * Routeur pour la fonctionnalité Context Reader (Analyse de texte -> Génération de mème)
 * Gère le endpoint principal /api/context-reader
 */

const express = require('express');
const router = express.Router();
const contextReaderController = require('../controllers/contextReaderController');

// Route POST principale pour analyser le contexte et suggérer/générer des mèmes
// Attends un corps de requête JSON contenant le texte à analyser.
router.post('/', contextReaderController.analyzeContext);

module.exports = router;
