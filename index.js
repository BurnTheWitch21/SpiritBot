const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const bot = new Discord.Client();
const token = '';
const PREFIX = '%';
var version = '1.0';
var servers = {};

function playSound(connection, message, sound) {
        
    const dispatcher = connection.play("files\\".concat(sound, ".mp3"));
    
    dispatcher.on("finish", function() {
        connection.disconnect();
    })
}

function checkVoiceChannel(message) {

    if (!message.member.voice.channel) {
        message.channel.send('Uđi u Đeneral, konju jedan!');
        return false;
    }

    return true;
}


bot.on('ready', () => {
    console.log("Aaaaah, I\'m here!");
})

bot.on('message', message => {

    if (message.content === "Za dom") {
        message.channel.send("Spremni!");
        return;
    }

    if (!message.content.startsWith(PREFIX)) return;
    let args = message.content.substring(PREFIX.length).split(" ");

    
    switch(args[0]) {
        
        case 'play':

            function play(connection, message) {
                var server = servers[message.guild.id];
                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: 'audioonly'}));
                server.queue.shift();
                server.dispatcher.on('finish', function() {
                    if (server.queue[0]) {
                        play(connection, message);
                    }
                    else {
                        connection.disconnect();
                    }
                })
            }

            if (!checkVoiceChannel(message)) return;

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection) {
                play(connection, message);
            })

            break;

        case 'kreme':
        case 'žepče':
        case 'spanish':
        case 'gae':
        case 'ronaldinho':
        case 'piper':
        case 'malay':
        case 'hehe':
        case 'hushashmidter':
        case 'autilagi':
        case 'wololo':
        case 'hepek':
        case 'jebogabog':
        case 'karakter':
        case 'vululu':

            if (!checkVoiceChannel(message)) return;

            if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection) {
                playSound(connection, message, args[0]);
            })
            
            break;
        
        case 'about':
            message.channel.send("Version: ".concat(version, "\nAuthor: BurnTheWitch\nPojava: sucks\nGitHub: https://github.com/BurnTheWitch21/SpiritBot.git"));
            break;
            
    }

})


bot.login(token);