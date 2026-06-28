/**
 * Contrôleur pour la fonctionnalité Voice to Meme
 * Gère la transcription audio via AssemblyAI et la génération de légendes via Gemini
 */

const fs = require("fs");
const { AssemblyAI } = require("assemblyai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const assembly = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateCaptionWithRetry(prompt, maxRetries = 3) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

async function transcribeAudio(filePath) {
  const data = fs.readFileSync(filePath);
  const transcript = await assembly.transcripts.transcribe({
    audio: data,
    language_code: "fr",
  });
  if (transcript.status === "error") {
    throw new Error(transcript.error);
  }
  return transcript.text;
}

exports.processVoiceToMeme = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Aucun fichier audio reçu"
      });
    }

    const transcript = await transcribeAudio(req.file.path);

    const prompt = `
Tu es un assistant créatif.
Une transcription audio est fournie ci-dessous.
Ta mission est de créer une nouvelle légende humoristique inspirée de l'ambiance générale.
Règles :
- Ne recopie jamais la transcription.
- Ne cite jamais les paroles.
- Ne résume pas le texte.
- Invente une phrase drôle originale.
- Réponds uniquement par une seule phrase en français.

Transcription :
${transcript}
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
      transcript: transcript,
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
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Erreur suppression fichier :", err.message);
      });
    }
  }
};
