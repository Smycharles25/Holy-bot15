exports = {
  config: {
    name: "uptime",
    aliases: [".uptime"],
    version: "2.5",
    author: "SamyCharlesღ",
    countDown: 5,
    role: 0,
    description: {
      fr: "Affiche depuis combien de temps le bot est actif, l'heure actuelle et d'autres infos adorables."
    },
    category: "informations"
  },

  onStart: async function ({ message, usersData }) {
    const nameBot = global.GoatBot.config.botName || "SAMY BOT 🧸";
    const prefix = global.GoatBot.config.prefix || ".";
    const ownerID = "61566160637367";
    const ownerName = await usersData.getName(ownerID);

    const uptime = process.uptime();
    const maxUptime = 24 * 60 * 60;

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const remaining = maxUptime - uptime;
    const rHours = Math.floor(remaining / 3600);
    const rMinutes = Math.floor((remaining % 3600) / 60);
    const rSeconds = Math.floor(remaining % 60);

    const now = new Date();
    const date = now.toLocaleDateString("fr-FR");
    const time = now.toLocaleTimeString("fr-FR");

    const msg = `
╭─────────────🎀
│   💖 𝑺𝒂𝒎𝒚 𝑩𝒐𝒕 𝒔𝒖𝒓 𝒑𝒊𝒆𝒅 ! 💖
│
├ 📅 𝗗𝗮𝘁𝗲 : ${date}
├ 🕰️ 𝗛𝗲𝘂𝗿𝗲 : ${time}
├ 🧸 𝗣𝗿𝗲́𝗳𝗶𝘅𝗲 : ${prefix}
├ 👑 𝗢𝘄𝗻𝗲𝗿 : ${ownerName}
│
├ ✅ 𝗔𝗰𝘁𝗶𝗳 𝗱𝗲𝗽𝘂𝗶𝘀 :
│    ⏱ ${hours}h ${minutes}m ${seconds}s
│ 
╰─💌 𝗠𝗲𝗿𝗰𝗶 𝗱'𝗲𝘁𝗿𝗲 𝗹𝗮 𝗮𝘃𝗲𝗰 ${nameBot} ! 🌸`;

    return message.reply({
      body: msg,
      mentions: [{
        id: ownerID,
        tag: ownerName
      }]
    });
  }
};
