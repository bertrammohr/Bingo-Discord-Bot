const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    eventName: "interactionCreate",
    disabled: false,
    run: async (client, config, interaction) => {
        try {
            if (interaction.isCommand()) {
                client.commands.get(interaction.commandName).run(client, config, interaction)
            } else if (interaction.isButton() || interaction.isSelectMenu()) {

                var interactionIndex = interaction.customId.slice(37);
                if (interaction.customId.slice(0, 36) != global.bingogame.id) {
                    return interaction.update(global.emptymessage);
                }

                if (client.interactions.has(interactionIndex)) {
                    client.interactions.get(interactionIndex).run(client, config, interaction);
                }
            }
        } catch(err) {
            console.log(err);
            console.log(interaction);
        }
    }
}