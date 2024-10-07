const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");
const { v4: uuid } = require('uuid');

module.exports = {
    type: 1,
    options: [
        {
            name: "gevinst1",
            description: "Gevinst ved 1 række",
            type: 3,
            required: true
        },
        {
            name: "gevinst2",
            description: "Gevinst ved 2 rækker",
            type: 3,
            required: true
        },
        {
            name: "gevinst3",
            description: "Gevinst ved fuld plade",
            type: 3,
            required: true
        }
    ],
    
    permissions: [],
    defaultPermission: true,

    name: "creategame",
    description: "Opret bingo spil",
    disabled: false,
    run: async (client, config, interaction) => {

        var gm = await interaction.guild.members.fetch(interaction.user.id);
        var gmRoles = gm.roles.cache;

        // if (!gmRoles.has("754072941175635980") && !gmRoles.has("735656394870751243") && gm.id != "286184421269438465") {
        //     return interaction.reply({content: "Dette har du ikke adgang til.", ephemeral: true}).catch(() => {});
        // }

        var rewards = [
            interaction.options.getString('gevinst1'),
            interaction.options.getString('gevinst2'),
            interaction.options.getString('gevinst3')
        ]

        global.bingogame = {
            active: false,
            id: uuid(),
        
            rewards: rewards,
            stage: 0,
        
            players: new Discord.Collection(),
            host: interaction.user,
            
            msg: null,

            numbers: [],
        };

        interaction.reply({content: "Bingo spil oprettet!", ephemeral: true}).catch(console.log);

        interaction.guild.channels.fetch(interaction.channel.id).then(channel => {
            var newGameEmbed = global.createEmbed("newGame", interaction.user, rewards, 0);
            var buttons = new Discord.MessageActionRow().addComponents(
                global.createButton("joinGame")
            )
            channel.send({embeds: [newGameEmbed], components: [buttons]}).then(msg => {
                global.bingogame.msg = msg
            })
        })
    }
}