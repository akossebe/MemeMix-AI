const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier audio reçu.' });
  }

  const audioPath = req.file.path;

  try {
    const audioBuffer = fs.readFileSync(audioPath);
    const audioBase64 = audioBuffer.toString('base64');

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: req.file.mimetype || 'audio/mp4',
                  data: audioBase64,
                },
              },
              {
                text: `Transcris cet audio en texte, puis génère un meme drôle camerounais basé sur ce qui a été dit.
Réponds UNIQUEMENT avec un JSON valide au format exact :
{"transcript":"ce que la personne a dit","caption":"TEXTE DU MEME DRÔLE"}`,
              },
            ],
          },
        ],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const rawContent = geminiResponse.data.candidates[0].content.parts[0].text;

    let parsed;
    try {
      const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      parsed = { transcript: 'Audio reçu', caption: "QUAND ON COMPREND PAS CE QUE TU DIS 😂" };
    }

    res.status(200).json({
      transcript: parsed.transcript || 'Audio analysé',
      caption: parsed.caption || 'MEME VOCAL !',
    });

  } catch (error) {
    if (error.response) {
      console.error('Erreur Gemini:', error.response.data);
      return res.status(500).json({ error: `Erreur Gemini : ${JSON.stringify(error.response.data)}` });
    }
    console.error('Erreur interne:', error.message);
    res.status(500).json({ error: 'Erreur interne.' });
  } finally {
    try {
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    } catch (e) {}
  }
});

module.exports = router;
