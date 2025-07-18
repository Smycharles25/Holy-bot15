module.exports = {
  config: {
    name: "guess",
    version: "1.0",
    author: "Samy Charles",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Devine le nombre mystère" },
    category: "game",
    guide: { en: ".guess" }
  },

  onStart: async function ({ message, event, args, api, threadsData, usersData }) {
    const userID = event.senderID;
    const threadID = event.threadID;

    // Stockage temporaire du jeu dans threadData (par user)
    let game = await threadsData.get(threadID, "guessGame") || {};

    // Si pas d'argument, start game
    if (args.length === 0) {
      const secretNumber = Math.floor(Math.random() * 100) + 1;
      game[userID] = { secret: secretNumber, attempts: 0 };
      await threadsData.set(threadID, "guessGame", game);
      return message.reply("🎯 J'ai choisi un nombre entre 1 et 100. Devine-le en tapant `.guess [nombre]` !");
    }

    // Sinon on traite la tentative
    if (!game[userID]) return message.reply("❗ Tu n'as pas lancé de partie. Tape `.guess` pour commencer.");

    const guess = parseInt(args[0]);
    if (isNaN(guess) || guess < 1 || guess > 100) 
      return message.reply("❌ Entre un nombre valide entre 1 et 100.");

    game[userID].attempts++;
    await threadsData.set(threadID, "guessGame", game);

    if (guess === game[userID].secret) {
      await message.reply(`🎉 Bravo ! Tu as trouvé le nombre mystère (${guess}) en ${game[userID].attempts} essais.`);
      delete game[userID];
      await threadsData.set(threadID, "guessGame", game);
    } else if (guess < game[userID].secret) {
      await message.reply("⬆️ Plus grand !");
    } else {
      await message.reply("⬇️ Plus petit !");
    }
  }
};
