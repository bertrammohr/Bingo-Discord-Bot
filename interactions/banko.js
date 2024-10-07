const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    interactionIndex: "banko",
    disabled: false,
    run: async (client, config, interaction) => {
        var player = global.bingogame.players.get(interaction.user.id);
        if (!player) {interaction.update(global.emptymessage)};

        var points = global.devMode ? 3 : 0;
        player.card.forEach(row => {
            row = row.filter(n => n != 0);
            for (i=0; i < row.length; i++) {
                if (!global.bingogame.numbers.includes(row[i])) {
                    return
                }
            }
            points++;
        })

        if (points <= global.bingogame.stage) {
            return interaction.reply({ephemeral: true, content: 'Du har ikke banko.'}).catch(console.error);
        }

        global.bingogame.stage++;
        
        interaction.guild.channels.fetch(interaction.channelId).then(async channel => {
            const playerHasBingoEmbed = global.createEmbed("playerBingo", interaction.user, global.bingogame.players.size, global.bingogame.rewards, global.bingogame.stage);

            if (global.bingogame.stage > 2) {
                await interaction.update({
                    ...global.emptymessage,
                    content: 'Spillet er slut. Tak fordi du spillede med.'
                });
                global.bingogame.players.forEach(player => {
                    if (player.interaction) {
                        player.interaction.editReply({
                            ...global.emptymessage,
                            content: 'Spillet er slut. Tak fordi du spillede med.'
                        }).catch(console.log);
                    }

                    player.interaction = null;
                })
                
                global.bingogame.msg.delete();
                global.bingogame = {
                    active: false,
                    id: null,
                
                    rewards: [],
                    stage: 0,
                
                    players: new Discord.Collection(), // id: {user: <User>, card: <Card>, numbers: [], interaction: <Interaction>}
                    host: null, /* USER CLASS */
                
                    msg: null,
                    
                    numbers: [],
                };
            } else {
                var whyButton = new Discord.MessageActionRow().addComponents(
                    global.createButton("why")
                )

                await interaction.update({
                    ...global.emptymessage,
                    components: [whyButton], 
                    content: "Denne runde er slut. Tryk på `Vis plade`, for at spille videre."
                });
                global.bingogame.players.forEach(player => {
                    if (player.interaction) {
                        player.interaction.editReply({
                            ...global.emptymessage,
                            components: [whyButton],
                            content: "Denne runde er slut. Tryk på `Vis plade`, for at spille videre."
                        }).catch(console.log);
                    }

                    player.interaction = null;
                })

                var gameEmbed = global.createEmbed("gameEmbed", global.bingogame.rewards, global.bingogame.stage);
                global.bingogame.msg.edit({embeds: [gameEmbed]});
            }

            channel.send({embeds: [playerHasBingoEmbed]}).then(msg => {
                msg.react('🎉');
            });
        }) 
    }
}