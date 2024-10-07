const Discord = require("discord.js");
const fs = require("fs");

var recentlyEdited = false;

module.exports = {
    interactionIndex: "joinGame",
    disabled: false,
    run: async (client, config, interaction) => {

        await interaction.deferReply({ephemeral: true});
        var bingogame = global.bingogame;

        interaction.followUp({embeds: [global.createEmbed("joinEmbed")]}).catch(console.log);

        if (bingogame.players.has(interaction.user.id)) {
            var player = bingogame.players.get(interaction.user.id);

            if (player.interaction) {
                await player.interaction.editReply(global.emptymessage).catch(console.log);
            }

            bingogame.players.set(interaction.user.id, {
                ...player,
                interaction: interaction
            })
        } else {
            bingogame.players.set(interaction.user.id, {
                user: interaction.user, 
                card: global.generateCard(), 
                numbers: [], 
                interaction: interaction
            })
        }

        if (!recentlyEdited) {
            recentlyEdited = true;
            setTimeout(() => {
                recentlyEdited = false;
                if (global.bingogame.active) return;
                bingogame.msg.edit({embeds: [global.createEmbed("newGame", bingogame.host, bingogame.rewards, bingogame.players.size)]})
            }, 2000)
        }
    }
}