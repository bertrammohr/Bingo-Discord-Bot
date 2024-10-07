global.devMode = true;

const fs = require("fs");
const { v4: uuid } = require('uuid');
const readline = require('readline');
const chokidar = require('chokidar');
const {Client, Intents, Collection} = require("discord.js");

const config = require('./config.json');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})
require('./functions.js')();

// DEFAULT SETTINGS TO BE USED AFTER A GAME HAS ENDED
global.bingogame = {
    active: false,
    id: null,

    rewards: [],
    stage: 0,

    players: new Collection(), // id: {user: <User>, card: <Card>, numbers: [], interaction: <Interaction>}
    host: null, /* USER CLASS */

    msg: null,
    
    numbers: [],
};

global.emptymessage = {
    embeds: [],
    files: [],
    attachments: [],
    components: [],
    content: "Denne besked er ugyldig. Slet den venligst."
}

client.rawcommands = [];
client.commands = new Collection();
client.interactions = new Collection();

// var rl = readline.createInterface(process.stdin, process.stdout);
// chokidar.watch(['./events', './commands', './interactions', './functions.js'], {
//     ignoreInitial: true
// }).on('all', (event, path) => {

//     if (path.includes("functions.js")) {
//         return rl.question(`A change has happened to functions.js. Would you like to update it? [y/n] `, answer => {
//             if (answer.toLowerCase() != "y") return;
//             console.log("Reloading functions.js");
//             delete require.cache[require.resolve('./functions.js')];
//             require('./functions.js')();
//         })
//     }
    
//     var results = /(?<fileType>.*(?=\\))\\(?<fileName>.*.js)/gi.exec(path);
//     var { fileType, fileName } = results.groups;
//     fileType = fileType.split("\\")[0];

//     rl.question(`A change has happened to ${fileName}. Would you like to update it as type: ${fileType}? [y/n] `, answer => {
//         if (answer.toLowerCase() == "y") {
            
//             delete require.cache[require.resolve(`./${path}`)];
//             var file = require(`./${path}`);

//             if (fileType == "events") {

//                 removeAllListeners(file.eventName);

//                 client.on(file.eventName, (...args) => {
//                     if (file.disabled) return;
//                     file.run(client, config, ...args);
//                 });

//                 console.log("Updated bot event: " + file.eventName);

//             } else if (fileType == "commands") {
                
//                 client.commands.set(file.name, file);
//                 console.log("Updated handling for bot command: " + file.name);
                
//             } else if (fileType == "interactions") {
                
//                 client.interactions.set(file.interactionIndex, file);
//                 console.log("Updated handling for bot interaction: " + file.interactionIndex);

//             }
//         }
//     });
// });

function readDir(dir) {
    let returnarray = [];
    
    function search(dir) {
        fs.readdirSync(dir).forEach(f => {
            if (fs.statSync(dir+"/"+f).isDirectory()) {
                search(dir+"/"+f)
            } else{
                returnarray.push(dir+"/"+f)
            }
        })
    }
    search(dir)
    return returnarray
}

const commandFiles = readDir('./commands').filter(file => !file.includes('template.js'));
commandFiles.forEach(file => {
    const command = require(file);
    if (command.disabled) return;
    client.rawcommands.push(command);
    client.commands.set(command.name, command)
})

const eventFiles = readDir('./events').filter(file => !file.includes('template.js'));
eventFiles.forEach(file => {
    const event = require(file);
    if(event.disabled) return;
    client.on(event.eventName, (...args) => {
        event.run(client, config, ...args)
    })
})

const interactionFiles = readDir('./interactions').filter(file => !file.includes('template.js'));
interactionFiles.forEach(file => {
    const interaction = require(file);
    if (interaction.disabled) return;
    client.interactions.set(interaction.interactionIndex, interaction)
})

console.log(`Loaded ${commandFiles.length} commands: \n${client.commands.map(cmd => cmd.name).join(', ')}`);
console.log()
console.log(`Loaded ${interactionFiles.length} interactions: \n${client.interactions.map(int => int.interactionIndex).join(', ')}`);
console.log();

client.login(global.devMode ? "DEV BOT TOKEN" : require("./token.json"));