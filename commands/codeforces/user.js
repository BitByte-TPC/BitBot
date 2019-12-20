const Discord = require('discord.js');
const cf = require('./api/calls.js');

exports.run = async (client, message, args) => {

    let user = await cf.getUserInfo(args);
    user.forEach(newUser => {
      let embed = new Discord.RichEmbed();
      embed
        .setTitle(newUser.handle)
        .setDescription("https://codeforces.com/profile/" + newUser.handle)
        .addField("Rank", newUser.rank, true)
        .addField("Rating", newUser.rating, true)
        .addField("Highest Rank", newUser.maxRank, true)
        .addField("Highest Rating", newUser.maxRating, true)
        .setThumbnail("https:"+newUser.avatar);
    message.channel.send(embed);  
    });
    

};

exports.info = "Gives details about user.\n!codeforces user [user-names]\nMultiple user supported.";