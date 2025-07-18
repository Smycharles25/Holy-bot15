module.exports = {
  config: {
    name: "tagall",
    version: "1.0",
    author: "Samy Charles",
    countDown: 30,
    role: 1, // par exemple réservé aux admins de groupe
    shortDescription: { en: "Taguer tous les membres du groupe" },
    longDescription: { en: "Mentionne tous les membres du groupe par batchs pour éviter les limites." },
    category: "group",
    guide: { en: ".tagall" }
  },

  onStart: async function ({ message, event, api }) {
    const { threadID } = event;

    try {
      // Récupérer la liste des membres du groupe
      const threadInfo = await api.getThreadInfo(threadID);
      const members = threadInfo.participantIDs || [];

      if (members.length === 0) {
        return message.reply("🤔 Le groupe est vide ou impossible de récupérer les membres.");
      }

      const batchSize = 20; // nombre de mentions par message (ajuste selon ta limite)
      let msgCount = 0;

      // Fonction pour générer un bloc de mentions avec un style sympa
      function formatMention(userID, index) {
        return `🌟 𝕄𝕖𝕞𝕓𝕣𝕖 ${index + 1} : @${userID}`;
      }

      // Découper en batchs et envoyer message par message
      for (let i = 0; i < members.length; i += batchSize) {
        const batch = members.slice(i, i + batchSize);

        // Construire le message avec mentions
        let body = "⛧━━━━━━ ⟡ 𝐓𝐀𝐆𝐀𝐋𝐋 ⟡ ━━━━━━⛧\n\n";
        const mentions = [];
        batch.forEach((id, idx) => {
          body += `⚔️ ${formatMention(id, i + idx)}\n`;
          mentions.push({
            tag: `@${id}`,
            id: id,
            fromIndex: body.length - (`@${id}`).length,
            length: (`@${id}`).length
          });
        });

        body += `\n⛧━━━━━━━━━━━━━━━━━━━━⛧\n`;

        await api.sendMessage({ body, mentions }, threadID);
        msgCount++;
      }

      await message.reply(`✅ Tag de tous les membres terminé en ${msgCount} message(s).`);
    } catch (error) {
      console.error(error);
      await message.reply("❌ Une erreur est survenue lors du tag des membres.");
    }
  }
};
