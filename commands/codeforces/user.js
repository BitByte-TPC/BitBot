const Discord = require('discord.js');
const cf = require('./api/calls.js');

exports.run = async (client, message, args) => {
    const color = {
      "3000-9999" : "#FF0000",
      "2600-2999" : "#FF00FF",
      "2400-2599" : "#FF00FF",
      "2100-2399" : "#FF8C00",
      "1900-2099" : "#AA00AA",
      "1600-1899" : "#0000FF",
      "1400-1599" : "#03A89E",
      "1200-1399" : "#00CC00",
      "0-1199" : "#444444"
    }  
    
    let colour = (value) => {
      var item;
      Object.keys(color).some(k => {
        var part = k.split('-');
        if(+value < part[1] && +value > part[0])
          item = color[k];
      });
      return item;
    }
  
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
        .setColor(colour(newUser.rating))
        .setThumbnail("https:"+newUser.avatar);
    message.channel.send(embed);  
    });
    

};

exports.info = "Gives details about user.\n`-cf user [user-names]`\nMultiple user supported.";