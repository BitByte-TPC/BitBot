const web = require('./scrape/scrap.js');

exports.run = (client,message,args) => {
    web.getSub(args,text => {
        if(!text){
            message.channel.send("Solution not available");
            return;
        }    
        // let embed = new Discord.RichEmbed();
        text = "```"+text+"```";
        message.channel.send(`${message.author.username}'s Solution :`+text);
    })
}