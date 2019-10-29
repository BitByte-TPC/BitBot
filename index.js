const discord = require('discord.js');
const client  = new discord.Client();
const config = require('./config.json');

client.on("ready",()=>{
    console.log('Me ready..');
});

client.on("message",(message)=>{
    if (message.author.bot) return;
    // This is where we'll put our code.
    if (message.content.indexOf(config.prefix) !== 0) return;

    var msg = message.content;
    const ch = message.channel;
    const args = msg.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (!msg.startsWith(config.prefix) || message.author.bot) return;
     if(command === "ping")
        ch.send("Pong!!");
    if(command=="kick"){
        let mem = message.mentions.members.first();
        mem.kick();
    }
    if(command == "say"){
        let txt = args.join(" ");
        message.delete();
        ch.send(txt);
    }
});

client.login(config.token);