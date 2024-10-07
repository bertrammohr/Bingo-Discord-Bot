const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    eventName: "ready",
    disabled: false,
    run: async (client, config) => {
        console.log(`${client.user.tag} booted at: ${client.readyAt.toLocaleString()}`);
        // client.application.commands.set(client.rawcommands);
        // client.guilds.fetch(global.devMode ? "848507804847308812" : "661361742282096650").then(guild => {
        //     guild.commands.set([]);
            // guild.commands.fetch().then(commands => {
            //     var fullPermissions = [];

            //     commands.forEach(command => {
            //         if (client.commands.has(command.name)) {
            //             fullPermissions.push({
            //                 id: command.id,
            //                 permissions: client.commands.get(command.name).permissions || [],
            //             })
            //         }
            //     })

            //     guild.commands.permissions.set({ fullPermissions: fullPermissions })
            // })
        // })
    }
}