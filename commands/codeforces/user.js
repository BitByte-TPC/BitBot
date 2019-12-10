const Discord = require('discord.js');
const web = require('./api/calls.js');

exports.run = (client,message,args) => {
    web.getDataOfUser(args, user =>{
        user.forEach((e,i) => {
            let embed = new Discord.RichEmbed();
            embed
            .setTitle(user[i].handle)
            .setDescription("https://codeforces.com/profile/"+user[i].handle)
            .addField("Rank",user[i].rank).addField("Rating",user[i].rating)
            .addField("Highest Rank",user[i].maxRank).addField("Highest Rating",user[i].maxRating)
            .setThumbnail(user[i].iconURL);
            message.channel.send(embed);
        });
        
    });
};

exports.info = "Gives details about user.\n!codeforces user [user-names]\nMultiple user supported.";