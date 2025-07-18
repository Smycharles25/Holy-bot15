const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "𝙎𝘼𝙈𝙔 𝘽𝙊𝙏 🩷🧸\n";

function formatFont(text) {
  const fontMapping = {
    A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆",
    H: "𝐇", I: "𝐈", J: "𝐉", K: "𝐊", L: "𝐋", M: "𝐌", N: "𝐍",
    O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑", S: "𝐒", T: "𝐓", U: "𝐔",
    V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙", 1: "𝟏", 2: "𝟐",
    3: "𝟑", 4: "𝟒", 5: "𝟓", 6: "𝟔", 7: "𝟕", 8: "𝟖", 9: "𝟗", 0: "𝟎"
  };
  return text.split('').map(char => fontMapping[char.toUpperCase()] || char).join('');
}

function formatFonts(text) {
  const fontList = {
    a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐",
    h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖", n: "𝚗",
    o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞",
    v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣", 1: "𝟷", 2: "𝟸",
    3: "𝟹", 4: "𝟺", 5: "𝟻", 6: "𝟼", 7: "𝟽", 8: "𝟾", 9: "𝟿", 0: "𝟶"
  };
  return text.split('').map(char => fontList[char.toLowerCase()] || char).join('');
}

// Variable globale pour alterner le style
let toggleHelpStyle = false;

module.exports = {
  config: {
    name: "help",
    version: "1.21",
    author: "Samy Charles",
    countDown: 9,
    role: 0,
    shortDescription: { en: "Afficher les commandes disponibles" },
    longDescription: { en: "Voir toutes les commandes disponibles classées par catégorie." },
    category: "info",
    guide: { en: ".help [nom_commande]" },
    priority: 1
  },

  onStart: async function({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = await getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      for (const [name, value] of commands) {
        if (value.config.role > role) continue;
        const category = value.config.category || "𝙉𝙊 𝘾𝘼𝙏𝙀𝙂𝙊𝙍𝙔";
        if (!categories[category]) categories[category] = { commands: [] };
        categories[category].commands.push(name);
      }

      let commandsList = "";
      Object.keys(categories).sort().forEach(category => {
        commandsList += `🌸 〘 ${formatFont(category.toUpperCase())} 〙\n`;
        categories[category].commands.sort().forEach(cmdName => {
          commandsList += ` ⤷ 💠 ${formatFonts(cmdName)}\n`;
        });
        commandsList += `┈┈┈┈┈┈┈┈┈┈┈┈\n`;
      });

      const totalCommands = commands.size;

      toggleHelpStyle = !toggleHelpStyle;

      const style1 = `⛧━━━━━━ ⟡ 𝐒𝐀𝐌𝐘 𝐁𝐎𝐓 ⟡ ━━━━━━⛧

🧠 𝑻𝒐𝒕𝒂𝒍 : ${totalCommands} 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒆𝒔  
⛩️ 𝑷𝒓𝒆𝒇𝒊𝒙 : ${prefix}  
🌐 𝑨𝒖𝒕𝒉𝒐𝒓 : 𝑺𝒂𝒎𝒚 𝑪𝒉𝒂𝒓𝒍𝒆𝒔

╭───〔 ⚔️ 𝐌𝐄𝐍𝐔 〕───╮
${commandsList}╰────────────────╯

⛧━━━━━━━━━━━━━━━━━━━━⛧`;

      const style2 = `╔═══[ 🔮 𝐒𝐀𝐌𝐘 𝐁𝐎𝐓 🔮 ]═══╗

🧠 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒆𝒔 : ${totalCommands}  
⚔️ 𝑷𝒓𝒆𝒇𝒊𝒙     : ${prefix}  
👑 𝑨𝒖𝒕𝒉𝒐𝒓     : Samy Charles

╔═[ 𝐌𝐄𝐍𝐔 ]═╗
${commandsList}╚════════════╝

╚═══════✦═══════╝`;

      const response = toggleHelpStyle ? style2 : style1;

      await message.reply({ body: response + "\n" + doNotDelete });
    } else {
      // Code inchangé pour la commande spécifique (détail)
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`🚫 Commande "${commandName || "undefined"}" introuvable.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Inconnu";
        const longDescription = configCommand.longDescription?.en || "Pas de description";
        const guideBody = configCommand.guide?.en || "Aucune indication disponible.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭──[ 💖 𝑺𝒂𝒎𝒚 𝑩𝒐𝒕 𝑯𝒆𝒍𝒑 💖 ]──╮\n` +
          `🔹 Nom : ${configCommand.name}\n` +
          `🔹 Description : ${longDescription}\n` +
          `🔹 Autres noms : ${configCommand.aliases ? configCommand.aliases.join(", ") : "Aucun"}\n` +
          `🔹 Version : ${configCommand.version || "1.0"}\n` +
          `🔹 Rôle : ${roleText}\n` +
          `🔹 Temps d’attente : ${configCommand.countDown || 2}s\n` +
          `🔹 Auteur : ${author}\n` +
          `🔸 Utilisation : ${usage}\n` +
          `╰────────────────────────╯`;

        await message.reply(response);
      }
    }
  }
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return "0 (Tous les utilisateurs)";
    case 1: return "1 (Admins de groupe)";
    case 2: return "2 (Admins du bot)";
    default: return "Rôle inconnu";
  }
    }
