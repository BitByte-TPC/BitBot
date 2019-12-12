const Discord = require('discord.js');

exports.run = (client,message,args) => {
    let embed = new Discord.RichEmbed();
    embed.setTitle("Bot Source code is located in")
        .setDescription("https://github.com/get-thepacket/discord-bot.git");
    message.channel.send(embed);
}