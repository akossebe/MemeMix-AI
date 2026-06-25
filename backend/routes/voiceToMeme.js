const express = require("express");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateCaptionWithRetry(prompt, maxRetries = 3) {
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      lastError = error;
      const status = error?.status;

      console.log(`Tentative Gemini ${attempt}/${maxRetries} échouée. Status: ${status}`);

      if (status === 503 && attempt < maxRetries) {
        await sleep(2000 * attempt);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Aucun fichier audio reçu"
      });
    }

    const fakeTranscript = `Audio reçu : ${req.file.originalname}`;

    const prompt = `
Tu es un générateur de légendes de mèmes.
À partir de ce contexte :
"${fakeTranscript}"

Génère UNE légende de mème drôle, courte, naturelle, en français.
Réponds uniquement par la légende, sans explication.
`;

    let caption;
    let source = "gemini";

    try {
      caption = await generateCaptionWithRetry(prompt, 3);
    } catch (geminiError) {
      console.error("Gemini indisponible, fallback local activé :", geminiError?.message);

      caption = "Moi qui pensais que tout allait marcher du premier coup 😭";
      source = "fallback";
    }

    return res.status(200).json({
      success: true,
      transcript: fakeTranscript,
      caption,
      source,
      audioInfo: {
        originalname: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error("=== ERREUR BACKEND VOICE-TO-MEME ===");
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Erreur serveur lors du traitement voice-to-meme",
      details: error?.message || "Erreur inconnue"
    });
  }
});

module.exports = router;