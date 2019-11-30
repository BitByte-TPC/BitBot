const Discord = require('discord.js');
const fs = require('fs');

exports.run = (client,message,args) => {
    var embed = new Discord.RichEmbed();
    embed.setTitle('All of the commands');
    embed.setDescription('Use commands with prefix "'+client.config.prefix+'". Thank you!');
    embed.setColor([255,255,255]);

    for(const [cmd,file] of client.commands.entries()){
        if(file.info)
            embed.addField(cmd,file.info);
    }
    message.channel.send(embed);
}

exports.info = "Print the help list";