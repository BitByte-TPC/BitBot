const web = require('./scrape/scrap.js');
const Discord = require('discord.js');
// const hljs = require('highlight.js');

exports.run = (client,message,args) => {
    // //in testing
    // //gives out the info of the solution - it's link, profile link and contest link
    // web.getUser(args, user => {
    //     if(!user){
    //         message.channel.send("User doesn't exists");
    //         return;
    //     }
    //     let embed = new Discord.RichEmbed();
    //     embed.addField("Problem link",user.problem)
    //         //.addField("Contest link",user.contest)
    //         .addField("Profile link",user.profile);
    //     message.channel.send(embed);
    // });
    //calls getSub function to get solution as plaintext and format it here
    web.getSub(args,text => {
        if(!text){
            message.channel.send("Solution not available");
            return;
        }    
        // let embed = new Discord.RichEmbed();
        // text = hljs.highlightAuto(text).value;
        //text = "```"+text+"```"; //add backticks for formatting
        text = text.match(/(.|[\r\n]){1,1990}/g); //found on stackoverflow split string in list with element size 1990
        message.channel.send(`${message.author.username}'s Solution :`);
        text.forEach(e => {
            message.channel.send("```"+e+"```");
        });
    });
    
}

exports.info = "Print solution as a text message and it's info\n!codechef solution 'solution-id'";