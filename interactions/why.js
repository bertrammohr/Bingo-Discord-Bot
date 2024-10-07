const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    interactionIndex: "why",
    disabled: false,
    run: async (client, config, interaction) => {
        interaction.reply({content: `Discord har indført, så man kun kan redigere "skjulte" beskeder i 15 minutter.\nDet endte med at blive et problem i første uge, hvor botten crashede.\nDerfor skal I nu opdatere spillerplade beskeden efter hver runde.`, ephemeral: true}).catch(console.log);
    }
}