const OWNER_UID = "61566160637367";

module.exports = {
  config: {
    name: "bank",
    version: "2.0",
    author: "SamyGPT",
    usage: ".bank [option]",
    cooldown: 5
  },

  onStart: async function ({ args, event, message, usersData }) {
    const { senderID } = event;
    const action = args[0]?.toLowerCase();
    const userData = await usersData.get(senderID);
    userData.bank = userData.bank || { money: 0 };
    userData.credit = userData.credit || { amount: 0, time: 0 };

    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;

    if (userData.credit.amount > 0 && now - userData.credit.time >= twoHours) {
      userData.money -= userData.credit.amount;
      message.reply(`⏰ Crédit expiré de ${userData.credit.amount}$ retiré.`);
      userData.credit.amount = 0;
      userData.credit.time = 0;
    }

    switch (action) {
      case "solde":
        return message.reply(`🏦 Solde : ${userData.bank.money.toLocaleString()} $`);

      case "deposer": {
        const m = parseInt(args[1]);
        if (isNaN(m) || m <= 0 || userData.money < m) return message.reply("❌ Erreur dépôt.");
        userData.money -= m;
        userData.bank.money += m;
        break;
      }

      case "retirer": {
        const m = parseInt(args[1]);
        if (isNaN(m) || m <= 0 || userData.bank.money < m) return message.reply("❌ Erreur retrait.");
        userData.bank.money -= m;
        userData.money += m;
        break;
      }

      case "pret": {
        const m = parseInt(args[1]);
        if (isNaN(m) || m <= 0 || userData.credit.amount > 0) return message.reply("❌ Erreur prêt.");
        userData.money += m;
        userData.credit.amount = m;
        userData.credit.time = now;
        return message.reply(`✅ Crédit de ${m}$ accordé !`);
      }

      case "rembourser": {
        if (userData.credit.amount <= 0 || userData.money < userData.credit.amount) return message.reply("❌ Erreur remboursement.");
        userData.money -= userData.credit.amount;
        userData.credit.amount = 0;
        userData.credit.time = 0;
        return message.reply("✅ Crédit remboursé !");
      }

      case "top": {
        const all = await usersData.getAll();
        const top = all.map(u => ({
          name: u.name,
          money: u.bank?.money || 0
        })).sort((a, b) => b.money - a.money).slice(0, 5);
        return message.reply(
          "🏆 Top banques :\n" +
          top.map((u, i) => `#${i + 1}. ${u.name} – ${u.money}$`).join("\n")
        );
      }

      case "add":
        if (senderID !== OWNER_UID) return;
        const plus = parseInt(args[1]);
        userData.bank.money += plus;
        return message.reply(`💰 ${plus}$ ajouté.`);

      case "remove":
        if (senderID !== OWNER_UID) return;
        const minus = parseInt(args[1]);
        userData.bank.money -= minus;
        return message.reply(`💸 ${minus}$ retiré.`);

      case "reset":
        if (senderID !== OWNER_UID) return;
        userData.bank.money = 0;
        return message.reply("🔁 Bank reset.");

      case "bonus":
        userData.bank.money += 5000;
        return message.reply("🎁 Bonus de 5000$ ajouté à ta banque.");

      case "lock":
        userData.bank.locked = true;
        return message.reply("🔒 Banque verrouillée temporairement.");

      case "unlock":
        userData.bank.locked = false;
        return message.reply("🔓 Banque déverrouillée.");

      default:
        return message.reply(
`🏦 𝑩𝑨𝑵𝑸𝑼𝑬 • 𝙎𝙖𝙢𝙮 𝙂𝘾 💼

🔸 .bank solde
🔹 .bank deposer [montant]
🔸 .bank retirer [montant]
🔹 .bank pret [montant]
🔸 .bank rembourser
🔹 .bank top
🔸 .bank bonus
🔹 .bank lock
🔸 .bank unlock
🔹 .bank add [X] (Admin)
🔸 .bank remove [X] (Admin)
🔹 .bank reset (Admin)

🧠 UID Samy : accès illimité 💳`
        );
    }

    await usersData.set(senderID, userData);
  }
};
