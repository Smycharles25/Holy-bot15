module.exports = {
  config: {
    name: "slot",
    version: "1.0",
    author: "SamyGPT",
    description: "Machine à sous pour tenter de gagner ou perdre de l'argent",
    usage: ".slot",
    cooldown: 5
  },

  onStart: async function ({ args, message, usersData, event }) {
    const userID = event.senderID;
    const bet = 1000; // 💸 Montant par défaut à parier

    // 🏦 Récupérer l'argent du joueur
    const userData = await usersData.get(userID);
    let money = userData.money || 0;

    if (money < bet) {
      return message.reply("❌ Tu n'as pas assez d'argent pour jouer (il faut au moins 1000 $).");
    }

    // 🎰 Symboles à utiliser
    const symbols = ["🍒", "🍋", "🍉", "💎", "7️⃣", "🔔"];
    const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

    const slots = `🎰 | ${slot1} | ${slot2} | ${slot3} |`;

    // 💸 Logique de gain (très difficile)
    let gain = 0;
    if (slot1 === slot2 && slot2 === slot3) {
      gain = bet * 10; // Jackpot 🎉
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      gain = bet * 2; // Petite victoire
    } else {
      gain = -bet; // Perte
    }

    // 💰 Met à jour l'argent du joueur
    userData.money += gain;
    await usersData.set(userID, userData);

    // 🧾 Message final
    const resultMsg = gain > 0
      ? `✨ Gagné : +${gain.toLocaleString()} $ !`
      : `💸 Perdu : -${bet.toLocaleString()} $`;

    const total = `💰 Ton nouveau solde : ${userData.money.toLocaleString()} $`;

    message.reply(`${slots}\n\n${resultMsg}\n${total}`);
  }
};
