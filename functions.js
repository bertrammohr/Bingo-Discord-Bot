const {createCanvas, loadImage, CanvasRenderingContext2D} = require("canvas");
const { MessageEmbed, MessageButton } = require("discord.js");
const config = require('./config.json');

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
}

var image;
(async () => {
    image = await loadImage('./bingocards/fivemdk-newyear.jpg');
})()

module.exports = () => {

    global.getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    global.generateCard = () => {
        // Card declaration
        const card = [
            [], 
            [], 
            []
        ];
    
        // Card number generation - pt. 1 (1 for each column)
    
        for (var i = 0; i < 9; i++) {
            var random;
            if (i == 0) {
                random = global.getRandomInt(1, 9);
            } else if (i == 8) {
                random = global.getRandomInt(80, 90);
            } else {
                random = global.getRandomInt(i*10, 9+(i*10));
            }
    
            var randomRow = Math.floor(Math.random()*3);

            while (card[randomRow].filter(n => n != 0).length == 5) {
                randomRow = Math.floor(Math.random()*3);
            }

            for (var j = 0; j < 3; j++) {
                if (j == randomRow) {
                    card[j].push(random);
                } else {
                    card[j].push(0);
                }
            }
        }
    
        // Card number generation - pt. 2 (6 more added randomly)
    
        for (var i = 0; i < 6; i++) {
            function updateData() {
                var randomInt = global.getRandomInt(1, 90);
                var group = randomInt == 90 ? 8 : Math.floor(randomInt/10);
                while (card[0].includes(randomInt) || card[1].includes(randomInt) || card[2].includes(randomInt)) {
                    randomInt = global.getRandomInt(1, 90);
                    group = randomInt == 90 ? 8 : Math.floor(randomInt/10);
                }
    
                const rowsWhereGroupIsEmpty = [];
                for (var j = 0; j < 3; j++) {
                    if (card[j][group] == 0 && card[j].filter(n => n != 0).length < 5) {
                        rowsWhereGroupIsEmpty.push(j);
                    }
                }
    
                if (rowsWhereGroupIsEmpty.length > 0) {
                    const randomRow = rowsWhereGroupIsEmpty[Math.floor(Math.random()*rowsWhereGroupIsEmpty.length)];
                    card[randomRow][group] = randomInt;
                } else {
                    return updateData();
                }
            }
            updateData();
        }
    
        // 
        // Sorting of columns
        // 
        
        for (let i = 0; i < 9; i++) {
            var numbers = [card[0][i], card[1][i], card[2][i]];
            var cards = [];
            numbers = numbers.filter(number => number != 0)
            numbers.sort((a, b) => a - b);
            for (let j = 0; j < 3; j++) {
                if (card[j][i] != 0) {
                    cards.push(j)
                }
            }
    
            for (let j = 0; j < cards.length; j++) {
                card[cards[j]][i] = numbers[j];
            }
        }

        return card;
    }

    global.visualizeCard = async (card, activeNumbers) => {
        const width = 3130;
        const height = 1429;

        const outerBorder = 296;
        const innerBorder = 16;
        const gridSize = 268;

        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')
        
        ctx.drawImage(image, 0, 0, width, height);

        ctx.font = 'bold 50pt Sans'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        card.forEach((row, rowI) => {
            row.forEach((num, numI) => {
                if (num != 0) {
                    var x = outerBorder + (numI * gridSize) + (numI * innerBorder);
                    var y = outerBorder + (rowI * gridSize) + (rowI * innerBorder);

                    ctx.fillStyle = '#fff';
                    ctx.fillText(num, x + (gridSize / 2), y + (gridSize / 2));
                    
                    if (activeNumbers.includes(num)) {
                        ctx.fillStyle = 'rgba(190, 224, 54, 0.5)';
                        ctx.roundRect(x, y, gridSize, gridSize, 180).fill();
                    }
                }
            })
        })
        
        return canvas.toBuffer('image/jpeg');
    }

    global.createEmbed = (type, ...data) => {
        var embed = new MessageEmbed();
        embed.setFooter('Made by Mohr#6969', "https://cdn.discordapp.com/avatars/286184421269438465/a_9629d01f07d0b4a9c5ff32b8ef5e7513.png?size=512");

        if (type == "newGame") {
            var [user, rewards, players] = data;

            embed.setTitle('Nyt bingo spil')
                .setColor(config.embedColors.inform)
                .setDescription(`${user.username} har oprettet et bingo spil. 🎉 \nVent indtil vedkommende starter det. ⏱`)
                .addField('Præmie pulje', `Fuld plade: ${rewards[2]}\nTo rækker: ${rewards[1]}\nÉn række: ${rewards[0]}`)
                .addField('Spillere', `${players} spiller med`)
        
        } else if (type == "joinEmbed") {
            embed.setTitle("Du er nu tilmeldt dette bingo spil.")
                .setColor(config.embedColors.success)
                .addField('OBS', `Hvis du fjerner afviser denne besked, skal du trykke \`Vis plade\` eller \`Tilslut spil\` for at spille med igen.`)
        
        } else if (type == "cardEmbed") {
            embed.setColor(config.embedColors.inform)
                .setTitle("Din bingo plade")
                .setImage('attachment://image.png')
                .setFooter('Made by Mohr#6969 - Card by ningaard#1100', "https://cdn.discordapp.com/avatars/292920028012085248/7fc298f1a17743f4fcdab822559e693a.png?size=512");
                // .setFooter('Made by Mohr#6969 - Card by Synix#3135', "https://cdn.discordapp.com/avatars/286184421269438465/a_9629d01f07d0b4a9c5ff32b8ef5e7513.png?size=512");

        } else if (type == "gameEmbed") {
            var [rewards, stage] = data;

            embed.setColor(config.embedColors.success)
                .setTitle("Bingo spillet er i gang!")
                .addField('Præmie pulje', `Fuld plade: ${rewards[2]}\nTo rækker: ${rewards[1]}\nÉn række: ${rewards[0]}`)
            
            const stageLabel = ['1 række', '2 rækker', 'fuld plade'][stage];
            embed.setDescription(`Vi spiller nu på ${stageLabel}.`)
        
        } else if (type == "playerBingo") {
            var [user, players, rewards, stage] = data;

            embed.setTitle('BANKO!')
                .setDescription(`${user.username}(${user.id}) har banko! Ønsk dem tillykke!`)
                .setColor(config.embedColors.success)
                .addField('Spillere', `${players} spiller med`, true)
                .addField('Gevinst', `${rewards[stage-1]} ved ${['én række', 'to rækker', 'fuld plade'][stage-1]}`, true)

            if (stage > 2) {
                embed.addField('Sidste runde', 'Bingospillet er slut. Tak fordi I spillede med.')
            } else {
                embed.addField('Hvornår er næste banko?', `Lige nu spiller vi på ${stage == 1 ? 'to rækker' : 'fuld plade'}, hvor gevinsten er ${rewards[stage]}.`)
            }
        }
        
        else {
            return;
        }

        return embed;
    }

    global.createButton = (type) => {
        var button = new MessageButton()

        var gameId = global.bingogame.id;
        if (!gameId) throw new Error('Tried to create button without gameId');

        if (type == "joinGame") { // ✅
            button.setLabel('Tilslut spil')
            .setStyle('PRIMARY')
        } else if (type == "newNum") { // ✅ 
            button.setLabel('Nyt nummer')
            .setStyle('PRIMARY')
        } else if (type == "banko") { // ✅
            button.setLabel('Banko')
            .setStyle('SUCCESS')
        } else if (type == "showCard") { // ✅
            button.setLabel('Vis plade')
            .setStyle('SECONDARY')
        } else if (type == "showNumbers") { // ✅
            button.setLabel('Vis forrige numre')
            .setStyle('SECONDARY')
        } else if (type == "why") { // ✅
            button.setLabel('Hvorfor skal jeg trykke igen?')
            .setStyle('DANGER')
        }
        
        else {
            return;
        }
        
        button.setCustomId(`${gameId}-${type}`)
        return button;
    }

    global.getSnowflakeAge = (snowflake) => {
        var binary = snowflake.toString(2);
        while (binary.length < 64) {
            binary = `0${binary}`;
        }

        var binaryDate = binary.slice(0, 42)
        return Date.now() - (Date.parse("2015-01-01T00:00:00.000Z") + parseInt(binaryDate, 2));
    }
}