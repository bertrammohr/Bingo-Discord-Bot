const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    interactionIndex: "newNum",
    disabled: false,
    run: async (client, config, interaction) => {
        if (global.bingogame.numbers.length == 90) {
            return interaction.update({content: "Alle tal er gået."});
        }

        var newNum = global.getRandomInt(1, 90);
        while (global.bingogame.numbers.includes(newNum)) {
            newNum = global.getRandomInt(1, 90);
        }
        
        interaction.update({content: `Det næste nummer er: ${newNum}${global.bingogame.numbers.length > 2 ? `\nSidste tre numre: ${global.bingogame.numbers.slice(-3).join(', ')}`: ''}${global.bingogame.numbers.length > 0 ? `\nForrige tal: ${Array.from(global.bingogame.numbers).sort((a,b) => a-b).join(", ")}`: ''}`}).catch(console.error);
        global.bingogame.numbers.push(newNum);
    }
}