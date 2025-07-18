
module.exports = {
  config: {
    name: "samygc",
    version: "1.0",
    author: "Samy Charles",
    countDown: 5,
    role: 0, // Tout le monde peut utiliser
    shortDescription: { en: "Ajoute la personne au groupe Samy GC" },
    longDescription: { en: "Ajoute la personne dans le groupe via tid" },
    category: "group",
    guide: { en: ".samygc" }
  },

  onStart: async function ({ message, event, api }) {
    try {
      const userID = event.senderID;
      const groupID = "31559634143635525"; // ton tid groupe

      // Récupérer la liste des membres du groupe
      const infoGroup = await api.getThreadInfo(groupID);
      const members = infoGroup.participantIDs;

      // Vérifier si la personne est déjà dans le groupe
      if (members.includes(userID)) {
        await message.reply("⚠️ Vous êtes déjà dans le groupe シ︎𝐒𝐀𝐌𝐘 𝐆𝐂--❁");
        return;
      }

      // Ajouter la personne dans le groupe
      await api.addUserToGroup(userID, groupID);

      // Confirmer l'ajout
      await message.reply("✅ Vous aviez été ajouté dans le groupe de シ︎𝐒𝐀𝐌𝐘 𝐆𝐂--❁");
    } catch (error) {
      console.error(error);
      await message.reply("❌ Une erreur est survenue lors de l'ajout au groupe.");
    }
  }
};
