const web = require('./scrape/scrap.js');
const Discord = require('discord.js');

exports.run = (client,message,args) => {
    web.getData(args,user =>{
        if(!user)
            message.channel.send("User not found");
        let embed = new Discord.RichEmbed();
        embed.setTitle(`The following details are fetched`)
            .setDescription(`${user.name} - ${user.username}`)
            .addField("Stars",user.stars)
            .addField("Rating",user.rating)
            .setThumbnail(user.iconURL)
            .setColor(user.color);
        message.channel.send(embed);
    })
}