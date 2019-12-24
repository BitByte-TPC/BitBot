const codechef = require('./scrape/scrap.js');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    let user = await codechef.getUserInfo(args);

    if (!user)
        message.channel.send("User not found");

    let embed = new Discord.RichEmbed();
    embed.setTitle(`${user.name} - ${user.username}`)
  .setDescription("https://codechef.com/users/"+user.username)
        .addField("Stars", user.stars, true)
        .addField("Rating", user.rating, true)
        .addField("Highest Rating", user.highRating, true)
        .setColor(user.color);
    
        //if user doesnt have pfrofile pic use default
    if (!user.iconURL.startsWith("/"))
        embed.setThumbnail(user.iconURL);
    else embed.setThumbnail("https://www.codechef.com/" + user.iconURL);
    
    message.channel.send(embed);
}

exports.info = "Print user info of codechef user.\n`-cc user <user-id>`";