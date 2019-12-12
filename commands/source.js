const Discord = require('discord.js');

exports.run = (client,message,args) => {
    let embed = new Discord.RichEmbed();
    embed.setTitle("Bot Source")
        .setColor("#0366d6")
        .setDescription("https://github.com/get-thepacket/discord-bot.git");

    message.channel.send(embed);

}

exports.info = "Give source of the bot";