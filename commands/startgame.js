const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");

module.exports = {
    type: 1,
    options: [],

    permissions: [],
    defaultPermission: true,

    name: "startgame",
    description: "Start bingo spil",
    disabled: false,
    run: async (client, config, interaction) => {
        interaction.deferReply({ephemeral: true});

        var gm = await interaction.guild.members.fetch(interaction.user.id);
        var gmRoles = gm.roles.cache;

        // if (!gmRoles.has("754072941175635980") && !gmRoles.has("735656394870751243") && gm.id != "286184421269438465") {
        //     return interaction.reply({content: "Dette har du ikke adgang til.", ephemeral: true}).catch(() => {});
        // }

        setTimeout(() => {
            var buttons = new Discord.MessageActionRow().addComponents(
                global.createButton("newNum")
            );
            interaction.followUp({content: "Tryk nedenfor for at generere et nummer.", components: [buttons]}).catch(console.log);
        }, 1500);

        if (!global.bingogame.active) {
            global.bingogame.active = true;

            var gameEmbed = global.createEmbed("gameEmbed", global.bingogame.rewards, global.bingogame.stage);
            var gameButtons = new Discord.MessageActionRow().addComponents(
                global.createButton("showCard"),
                global.createButton("showNumbers")
            )
            
            global.bingogame.msg.edit({embeds: [gameEmbed], components: [gameButtons]});

            global.bingogame.players.forEach(async (player, i) => {
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
            
                if (player.interaction) {
                    player.interaction.editReply({embeds: [cardEmbed], components: [selectMenu, playerButtons], files: [cardImg]}).catch(console.log);
                }
            })
        }
    }
}