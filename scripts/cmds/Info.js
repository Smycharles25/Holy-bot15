const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
  config: {
    name: "info",
    version: "1.0",
    author: "Samy Charles",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Affiche mes infos personnalisées en image" },
    longDescription: { en: "Crée une image avec ta photo, nom, infos, style Canva-like." },
    category: "info",
    guide: { en: ".info" }
  },

  onStart: async function ({ message, event, api }) {
    try {
      const userID = "61566160637367"; // Ton UID Facebook
      const profilePicUrl = `https://graph.facebook.com/${userID}/picture?type=large`;

      // Charger la photo de profil
      const profilePic = await loadImage(profilePicUrl);

      // Créer un canvas 800x400 (par ex)
      const canvas = createCanvas(800, 400);
      const ctx = canvas.getContext('2d');

      // Fond stylé (dégradé bleu-rose)
      const gradient = ctx.createLinearGradient(0, 0, 800, 400);
      gradient.addColorStop(0, '#ff66cc');
      gradient.addColorStop(1, '#3366ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 400);

      // Dessiner un cercle pour la photo de profil
      const radius = 120;
      const centerX = 140;
      const centerY = 200;
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      // Dessiner la photo dans le cercle
      ctx.drawImage(profilePic, centerX - radius, centerY - radius, radius * 2, radius * 2);
      ctx.restore();

      // Texte infos (style moderne)
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px Arial';
      ctx.fillText("Samy Charles", 300, 120);

      ctx.font = '24px Arial';
      ctx.fillText("Âge : 14 ans+", 300, 180);
      ctx.fillText("Pays : Côte d'Ivoire", 300, 220);
      ctx.fillText("Quartier : Bingerville", 300, 260);
      ctx.fillText("A rejoint Facebook : 15 juillet 2021", 300, 300);

      // Générer buffer image PNG
      const buffer = canvas.toBuffer();

      // Envoyer dans le chat
      await api.sendMessage(
        { 
          body: "👑 Voici mes infos personnelles :", 
          attachment: buffer 
        },
        event.threadID
      );
    } catch (err) {
      console.error(err);
      await message.reply("❌ Une erreur est survenue lors de la génération de l'image.");
    }
  }
};
