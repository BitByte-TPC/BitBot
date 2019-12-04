const Discord = require('discord.js');
const web = require('./api/calls.js');

exports.run = (client,message,args) => {
    web.getData(args, user =>{
        let embed = new Discord.RichEmbed();
        embed
            .setAuthor(user.name,user.iconURL,user.url)
            .addField(user.profile_rank,user.rating)
            .addField(user.high_rank,user.high_rating);
        message.channel.send(embed);
    });
};