/**
 * Service de génération d'images IA (Bonus)
 * Ce service transforme un prompt textuel en une image réelle.
 * 
 * Note : Nous utilisons Pollinations.ai pour ce prototype car il est 
 * gratuit, rapide et ne nécessite pas de gestion de clés API complexes.
 */

async function generateImageFromPrompt(prompt) {
  try {
    // On nettoie le prompt pour qu'il soit compatible avec une URL
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Construction de l'URL vers le moteur de génération (Flux modèle)
    // On ajoute des paramètres pour garantir un style visuel de haute qualité
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&model=flux`;
    
    // On simule un petit délai pour la génération
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      imageUrl: imageUrl
    };
  } catch (error) {
    console.error("❌ Erreur dans le service de génération d'image :", error);
    return {
      success: false,
      error: "Échec de la génération d'image."
    };
  }
}

module.exports = { generateImageFromPrompt };
