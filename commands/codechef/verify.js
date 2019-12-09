const Discord = require('discord.js');
const web = require('./scrape/scrap');

exports.run = async function (client,message,args){
    // const ver = await web.verify(args);
    const question = await web.randomQuestion(); //get's link of the question [.link] and code[.pcode]
    let embed = new Discord.RichEmbed();
        embed.addField("You have 2 mins, submit a compilation error to this question",question.link);
    message.channel.send(embed);
};