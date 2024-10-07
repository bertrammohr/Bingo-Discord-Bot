const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");

module.exports = {
    type: 1,
    options: [
        {
            name: "user",
            description: "user to interact",
            type: 6 // 6 = USER, STRING = 3, INTEGER = 4, BOOLEAN = 5, USER = 6, ROLE = 8
        }
    ],

    permissions: [
        {
            id: '286184421269438465', // MOHR
            type: 'USER',
            permission: true,
        },
    ],
    defaultPermission: true,

    name: "template",
    description: "description",
    disabled: false,
    run: async (client, config, interaction) => {
        
    }
}