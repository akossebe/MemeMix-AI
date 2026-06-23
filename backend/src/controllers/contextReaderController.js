/**
 * Contrôleur pour la fonctionnalité Context Reader (Analyse de texte -> Génération de mème)
 * Ce fichier gère la logique principale de l'appel à l'API Google Gemini,
 * l'extraction du sens du texte, le choix du template de mème adéquat,
 * et la génération des mèmes pour les deux méthodes demandées.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Liste des templates de mèmes prédéfinis supportés par notre système
// Ces templates proviennent de l'API publique et gratuite 'memegen.link' qui permet de superposer du texte de manière dynamique.
const MEME_TEMPLATES = [
  {
    id: "drake",
    name: "Drake Hotline Bling",
    description: "Deux panneaux. Haut: Rejet d'une idée/situation. Bas: Approbation d'une autre idée/situation.",
    urlTemplate: "https://api.memegen.link/images/drake/{caption1}/{caption2}.png",
    example: "Haut: Écrire du code propre sans tests | Bas: Écrire des tests robustes et corriger les bugs",
    maxCaptions: 2
  },
  {
    id: "buttons",
    name: "Two Buttons",
    description: "Un personnage transpire face à un choix cornélien entre deux options contradictoires représentées par deux boutons.",
    urlTemplate: "https://api.memegen.link/images/buttons/{caption1}/{caption2}.png",
    example: "Haut: Pousser en prod vendredi | Bas: Attendre lundi matin",
    maxCaptions: 2
  },
  {
    id: "change",
    name: "Change My Mind",
    description: "Un homme assis à une table à l'extérieur avec un panneau affichant une opinion controversée ou un fait amusant.",
    urlTemplate: "https://api.memegen.link/images/change/{caption1}.png",
    example: "Le café est un groupe sanguin obligatoire pour les développeurs.",
    maxCaptions: 1
  },
  {
    id: "doge",
    name: "Swole Doge vs. Cheems",
    description: "Comparaison humoristique entre le passé glorieux/fort (Swole Doge, à gauche) et le présent faible/fainéant (Cheems, à droite).",
    urlTemplate: "https://api.memegen.link/images/doge/{caption1}/{caption2}.png",
    example: "Gauche: Les devs en 1990 programmant en Assembleur | Droite: Moi qui pleure car une div n'est pas centrée",
    maxCaptions: 2
  },
  {
    id: "disastergirl",
    name: "Disaster Girl",
    description: "Une petite fille sourit de manière diabolique au premier plan pendant qu'une maison brûle en arrière-plan (symbole de chaos provoqué).",
    urlTemplate: "https://api.memegen.link/images/disastergirl/{caption1}/{caption2}.png",
    example: "Haut: Pousser une modification mineure sans compiler | Bas: Le serveur de prod en feu",
    maxCaptions: 2
  }
];

/**
 * Fonction utilitaire pour encoder proprement les textes pour l'API memegen.link
 * memegen utilise des règles spéciales (ex: remplacer l'espace par '_', '?' par '~q', etc.)
 */
function sanitizeForMemeGen(text) {
  if (!text) return "_";
  return text
    .trim()
    .replace(/\?/g, '~q')
    .replace(/%/g, '~p')
    .replace(/#/g, '~h')
    .replace(/\//g, '~s')
    .replace(/\"/g, "''")
    .replace(/\s+/g, '_'); // Remplace les espaces par des underscores
}

/**
 * Moteur de Mock intelligent au cas où la clé API Gemini n'est pas configurée.
 * Permet aux développeurs et collaborateurs de tester l'application immédiatement.
 */
function getMockMemeResponse(inputText) {
  const textLower = inputText.toLowerCase();
  let selectedTemplate = MEME_TEMPLATES[0]; // Drake par défaut
  let captions = ["Faire quelque chose de difficile", "Faire quelque chose de facile"];
  let explanation = "Mème généré en mode Mock suite à la détection de concepts généraux.";

  if (textLower.includes("bug") || textLower.includes("erreur") || textLower.includes("crash")) {
    selectedTemplate = MEME_TEMPLATES[4]; // Disaster Girl
    captions = [
      "J'ai juste ajouté un point-virgule",
      "Le serveur de production en feu"
    ];
    explanation = "Analyse de crash détectée. Template Disaster Girl sélectionné.";
  } else if (textLower.includes("choix") || textLower.includes("hesiter") || textLower.includes("bouton") || textLower.includes("choisir")) {
    selectedTemplate = MEME_TEMPLATES[1]; // Two Buttons
    captions = [
      "Centrer la div avec Flexbox",
      "Centrer la div avec Grid"
    ];
    explanation = "Scénario de choix difficile détecté. Template Two Buttons sélectionné.";
  } else if (textLower.includes("cafe") || textLower.includes("coffee") || textLower.includes("matin")) {
    selectedTemplate = MEME_TEMPLATES[2]; // Change my mind
    captions = [
      "Le café résout 99% des problèmes de compilation"
    ];
    explanation = "Caféine détectée. Opinion affirmée sur table de discussion.";
  } else if (textLower.includes("code") || textLower.includes("programmation") || textLower.includes("dev")) {
    selectedTemplate = MEME_TEMPLATES[3]; // Doge vs Cheems
    captions = [
      "Devs en 2000 écrivant du C++ pur",
      "Moi pleurant devant un avertissement npm"
    ];
    explanation = "Contexte de développement logiciel détecté. Comparaison générationnelle.";
  } else {
    // Drake par défaut avec adaptation du texte utilisateur
    captions = [
      `Ignorer ce contexte : "${inputText.substring(0, 30)}..."`,
      "En faire un mème hilarant avec Gemini"
    ];
  }

  // Construction de l'URL finale via memegen.link
  let imageUrl = selectedTemplate.urlTemplate;
  captions.forEach((cap, index) => {
    imageUrl = imageUrl.replace(`{caption${index + 1}}`, sanitizeForMemeGen(cap));
  });
  // Nettoyer les éventuels placeholders non remplis
  imageUrl = imageUrl.replace(/{caption\d}/g, "_");

  return {
    isMock: true,
    memeIdea: explanation,
    method1: {
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      imageUrl: imageUrl,
      captions: captions
    },
    method2: {
      prompt: `A hilarious cartoon style representation of the context: "${inputText}". Soft colors, funny meme style, highly shareable.`,
      imageUrl: `https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80&w=600` // Image illustrative générique d'Unsplash pour le mock de l'IA Générative
    }
  };
}

/**
 * Endpoint POST : Analyse le contexte textuel et suggère des mèmes
 */
exports.analyzeContext = async (req, res) => {
  try {
    const { text } = req.body;

    // 1. Validation de l'entrée
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Le paramètre 'text' est requis et doit être une chaîne de caractères non vide."
      });
    }

    // 2. Vérification de la clé API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "votre_cle_api_gemini_ici") {
      console.warn("⚠️ Clé GEMINI_API_KEY non configurée dans .env. Utilisation du mode MOCK intelligent.");
      const mockResponse = getMockMemeResponse(text);
      return res.json({
        success: true,
        source: "MOCK_ENGINE",
        data: mockResponse
      });
    }

    // 3. Initialisation de l'API Google Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    // Utilisation du modèle gemini-1.5-flash (rapide, performant et supporte le mode JSON)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    // 4. Construction du Prompt Système ultra-détaillé
    const systemPrompt = `
Tu es l'intelligence artificielle principale de l'application MemeMixAI.
Ta tâche est d'analyser le contexte textuel fourni par l'utilisateur et d'en générer un concept de mème drôle et percutant.
Tu dois répondre STRICTEMENT sous la forme d'un objet JSON valide correspondant au schéma demandé.

Voici la liste des templates de mèmes prédéfinis que tu peux utiliser pour la MÉTHODE 1 (Superposition de texte) :
${JSON.stringify(MEME_TEMPLATES, null, 2)}

Pour la MÉTHODE 1 :
- Choisis le template le plus pertinent parmi la liste ci-dessus en fonction du texte de l'utilisateur.
- Rédige des légendes (captions) adaptées au template choisi, courtes, drôles et percutantes.
- Ne dépasse pas le nombre de légendes autorisé par le template (maxCaptions).

Pour la MÉTHODE 2 (Génération d'image complète par IA) :
- Écris un prompt très détaillé, en anglais, destiné à un générateur d'images IA (comme Imagen 3 ou DALL-E) pour créer un mème complet de toutes pièces correspondant au contexte textuel. Le prompt doit décrire la scène, le style visuel (dessin animé, art 3D drôle, peinture, etc.) et le texte à inclure directement sur l'image si nécessaire.

Le format JSON de ta réponse doit être EXACTEMENT le suivant :
{
  "memeIdea": "Une brève explication en français de l'idée humoristique du mème et du lien avec le texte.",
  "method1": {
    "templateId": "Identifiant du template choisi (ex: 'drake', 'buttons', 'change', 'doge', 'disastergirl')",
    "templateName": "Nom officiel du template",
    "captions": ["Légende 1", "Légende 2 (si applicable)"]
  },
  "method2": {
    "prompt": "Le prompt d'image en anglais ultra-détaillé pour l'IA générative"
  }
}

Le contexte textuel à analyser est le suivant :
"${text}"
`;

    // 5. Appel à l'API Gemini
    console.log(`🤖 Appel de l'API Gemini pour analyser le texte : "${text.substring(0, 50)}..."`);
    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    // 6. Parsing du JSON renvoyé par l'IA
    let aiData;
    try {
      aiData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Erreur lors du parsing JSON de la réponse Gemini :", responseText);
      throw new Error("La réponse de l'IA n'était pas un JSON valide.");
    }

    // 7. Post-traitement et construction des URLs finales pour le frontend
    const selectedTemplateId = aiData.method1.templateId;
    const selectedTemplate = MEME_TEMPLATES.find(t => t.id === selectedTemplateId) || MEME_TEMPLATES[0];

    // Construction de l'URL dynamiquement avec memegen.link pour la méthode 1
    let method1ImageUrl = selectedTemplate.urlTemplate;
    const captions = aiData.method1.captions || [];

    // Sécurise et injecte chaque légende dans l'URL du template
    captions.forEach((cap, index) => {
      method1ImageUrl = method1ImageUrl.replace(`{caption${index + 1}}`, sanitizeForMemeGen(cap));
    });
    // Nettoie les placeholders restants (si le template accepte 2 légendes mais que l'IA n'en a fourni qu'une)
    method1ImageUrl = method1ImageUrl.replace(/{caption\d}/g, "_");

    // Pour la méthode 2 (AI Image Generator) :
    // On peut construire une URL d'image factice ou utiliser un service de génération si configuré.
    // Pour cet exercice, nous fournissons le prompt optimisé généré par Gemini et une URL de placeholder visuel élégant.
    const method2ImageUrl = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600`;

    // 8. Envoi de la réponse JSON au frontend
    return res.json({
      success: true,
      source: "GEMINI_API",
      data: {
        memeIdea: aiData.memeIdea,
        method1: {
          templateId: selectedTemplate.id,
          templateName: selectedTemplate.name,
          imageUrl: method1ImageUrl,
          captions: captions
        },
        method2: {
          prompt: aiData.method2.prompt,
          imageUrl: method2ImageUrl // S'intègrera plus tard avec l'API Imagen ou DALL-E directement !
        }
      }
    });

  } catch (error) {
    console.error("❌ Une erreur est survenue dans le contrôleur ContextReader :", error);
    return res.status(500).json({
      success: false,
      error: "Une erreur interne est survenue lors du traitement du contexte de mème.",
      details: error.message
    });
  }
};
