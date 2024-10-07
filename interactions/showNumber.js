const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    interactionIndex: "showNumbers",
    disabled: false,
    run: async (client, config, interaction) => {
        interaction.reply({ephemeral: true, content: `Sidste tre numre: ${global.bingogame.numbers.slice(-3).join(', ')} \nAlle forrige numre: ${Array.from(global.bingogame.numbers).sort((a,b) => a-b).join(", ")}`}).catch(console.log)
    }
}