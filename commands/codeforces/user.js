const Discord = require('discord.js');
const cf = require('./api/calls.js');

exports.run = async (client, message, args) => {

    let user = await cf.getUserInfo(args[0]);

    let embed = new Discord.RichEmbed();
    embed
        .setTitle(user.handle)
        .setDescription("https://codeforces.com/profile/" + user.handle)
        .addField("Rank", user.rank, true)
        .addField("Rating", user.rating, true)
        .addField("Highest Rank", user.maxRank, true)
        .addField("Highest Rating", user.maxRating, true)
        .setThumbnail(user.iconURL);
    message.channel.send(embed);

};

exports.info = "Gives details about user.\n!codeforces user [user-names]\nMultiple user supported.";