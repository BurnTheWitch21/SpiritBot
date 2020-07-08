const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const ytsearch = require('youtube-search');

//reading tokens from token.txt
var tokens = fs.readFileSync("./token.txt", 'utf8').split('\n'); 
var token = tokens[0].trim();
var ytkey = tokens[1];

var opts = {
  maxResults: 1,
  key: ytkey
};
 
const bot = new Discord.Client();
const PREFIX = '%';
var version = '1.4';
var servers = {};

let memes = new Array();
let meme = 0;
let sounds = new Array();

//List of commands and the generation of string to output
var commands = ["meme", "sounds", "stormbringer", "guide", "play <url>", "about"];
commands.sort();
var commandsString = "";
commands.forEach((element,number) => commandsString += String(Number(number)+1)+". "+element+"\n");


function playSound(connection, message, sound) {
        
    const dispatcher = connection.play("files\\sounds\\".concat(sound, ".mp3"));
    
    dispatcher.on("finish", function() {
        connection.disconnect();
    })
}

function playYoutube(connection, message, link) {
        
    const dispatcher = connection.play(ytdl(link, {filter: 'audioonly'}));
    
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

    //Load memes  
    fs.readdir("files\\memes", (err, files) => { 
        if (err) 
            console.log(err); 
        else {
            memes = files;
            meme = memes[Math.floor(Math.random() * memes.length)];
        } 
    })

    //Load sounds
    fs.readdir("files\\sounds", (err, files) => { 
        if (err) 
            console.log(err); 
        else {
            sounds = files;
        } 
    })
    
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
        case 'zvuci':
        case 'sounds':
            var soundsLength = sounds.length;
            var output = "";
            for (var i = 0; i < soundsLength; i++) {
                output = output.concat("\n", (i+1).toString(), ". ", sounds[i]);
            }
            message.channel.send(output);
            break;
        
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
        
        case 'playyt':
            if (!checkVoiceChannel(message)) return;
            
            var query = args.slice(1).join(' ');

            var link = '';
            ytsearch(query, opts, function(err, results) {
                if(err) return console.log(err);
               
                link = results[0].link;
            });
            
            
            if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection) {
                playYoutube(connection, message, link);
            })

            message.channel.send('Spavaš li mirno, Bulaja?!');
            
            break;
        
        case 'meme':
            message.channel.send("", {files: ["files\\memes\\".concat(meme)]});
            meme = memes[Math.floor(Math.random() * memes.length)];

            break;
        
        case 'stormbringer':

            message.channel.send("<@374231273486548994>, I summon thee!", {files: ["files\\memes\\stormbringer.jpg"]});

            if (!checkVoiceChannel(message)) return;

            if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection) {
                playYoutube(connection, message, "https://www.youtube.com/watch?v=4C2K889u_90");
            })
            
            break;
        
        case 'guide':
            message.channel.send("Oho jel se to partija sprema?", {files: ["files\\documents\\Shikaku21318s_Guide_for_Wololo_Kingdoms_-2.pdf"]});
        
        case 'about':
            message.channel.send("Version: ".concat(version, "\nAuthor: BurnTheWitch\nPojava: sucks\nGitHub: https://github.com/BurnTheWitch21/SpiritBot.git"));
            break;
        
        case 'help':
            message.channel.send("Piši na našem konju jedan! Komanda je %pomagaj");
            break;
        
        case 'pomagaj':
            message.channel.send("Sve komande počinju sa '%', a na raspolaganju imaš:\n"+commandsString);
            break;

        default:
            if (sounds.includes("".concat(args[0], ".mp3"))) {
                if (!checkVoiceChannel(message)) return;

                if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection) {
                    playSound(connection, message, args[0]);
                })
            }     
    }
    
})


bot.login(token);

//stdin listener
let input = process.openStdin();
input.addListener("data", res => {
    let text = res.toString().trim().split(/ +/g);
    bot.channels.cache.get("594697848595939337").send(text.join(" "));
});
