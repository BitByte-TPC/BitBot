const web = require('./api/calls.js');
const Discord = require('discord.js');

exports.run = (client,message,args) => {
    message.channel.send('Command is not added yet');
    // //console.log(args);
    // web.getUser(args, user=>{
    //     if(!user){
    //         message.channel.send("User doesn't exists");
    //         return;
    //     }
    //     let embed = new Discord.RichEmbed();
    //     embed.addField("Profile link:",user.profile)
    //         .addField("Problem link:",user.problem);
    //     message.channel.send(embed);
    // });
    // web.getSub(args, text=>{
    //     if(!text){
    //         message.channel.send("Solution not found please enter again.");
    //         return;
    //     }

    //     text = text.match(/(.|[\r\n]){1,1990}/g); //found on stackoverflow split string in list with element size 1990
    //     message.channel.send(`${message.author.username}'s Solution :`);
    //     text.forEach(e => {
    //         message.channel.send("```"+e+"```");
    //     });
    // });
    
};

exports.info = "Fetches solution if contest code and solution code is given.\n!codechef solution contest-code solution-id";