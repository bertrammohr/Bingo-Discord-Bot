const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    interactionIndex: "showCard",
    disabled: false,
    run: async (client, config, interaction) => {
        var player = global.bingogame.players.get(interaction.user.id);
        if (!player) {return interaction.reply({ephemeral: true, content: "Du er ikke i spillet."}).catch(console.log)};
        
        if (player.interaction) {
            await player.interaction.editReply(global.emptymessage).catch(console.log);
        }
        
        player.interaction = interaction;

        const cardImg = new Discord.MessageAttachment(await global.visualizeCard(player.card, player.numbers), 'image.png');
        var cardEmbed = global.createEmbed("cardEmbed");
        
        var playerButtons = new Discord.MessageActionRow().addComponents(
            global.createButton("banko")
        )

        const selectMenu = new Discord.MessageActionRow().addComponents(
            new Discord.MessageSelectMenu()
                .setCustomId(`${global.bingogame.id}-select`)
                .setPlaceholder('Fjern eller læg en brik')
                .addOptions(player.card[0].concat(player.card[1], player.card[2]).sort((a,b) => a-b).filter(n => n != 0).map(num => {
                    return {
                        label: `${num}`,
                        description: `Fjern eller læg en brik på ${num}'s plads`,
                        value: `${num}`,
                    }
                })),
        );

        interaction.reply({ephemeral: true, embeds: [cardEmbed], components: [selectMenu, playerButtons], files: [cardImg], attachments: []}).catch(console.log);
    }
}