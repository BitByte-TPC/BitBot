const Discord = require('discord.js');

exports.run = (client,message,args) => {
    let embed = new Discord.RichEmbed();
    embed.setTitle("Bot Source")
        .setColor("#0366d6")
        .setDescription("https://github.com/BitByte-TPC/discord-bot");

    message.channel.send(embed);

}

exports.info = "Give source of the bot";