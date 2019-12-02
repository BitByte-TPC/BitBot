const web = require('./scrape/scrap.js');
const Discord = require('discord.js');

exports.run = (client,message,args) => {
    web.getData(args,(user) =>{
        if(!user)
            message.channel.send("User not found");
        let embed = new Discord.RichEmbed();
        //User details in embed
        embed.setTitle(`The following details are fetched`)
            .setDescription(`${user.name} - ${user.username}`)
            .addField("Stars",user.stars)
            .addField("Rating",user.rating)
            .addField("Highest Rating",user.highRating)
            .setColor(user.color);
            //Setting thumbnail with some magic
            if(!user.iconURL.startsWith("/"))
                embed.setThumbnail(user.iconURL);
            else embed.setThumbnail("https://www.codechef.com/"+user.iconURL);
        message.channel.send(embed);
    })
}

exports.info = "Print user info of codechef user.\n!codechef stars 'user-id'";