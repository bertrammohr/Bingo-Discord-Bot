const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    eventName: "ratelimit",
    disabled: false,
    run: async (client, config, data) => {
        console.log('rateLimit', data)
    }
}