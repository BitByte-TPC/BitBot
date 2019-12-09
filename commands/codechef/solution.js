const web = require('./scrape/scrap.js');
const Discord = require('discord.js');
// const hljs = require('highlight.js');

exports.run = async function(client,message,args){
    // //in testing
    // //gives out the info of the solution - it's link, profile link and contest link
    const p = await web.getSub(args);
    const profile = p.data;
    console.log(profile);
    if(profile.testInfo == ''){
        message.channel.send("Solution not found!");
        return;
    }
    let colors = {
        "Compilation Error" : "ffcf2a",
        "Accepted" : "12c200",
        "Rejected" : "df0101",
        "Time Limit Exceeded" : "df0101",
        "Runtime Error":"df0101"
    }
    let text = profile.plaintext;
    text = text.match(/(.|[\r\n]){1,1990}/g); //found on stackoverflow split string in list with element size 1990
    let embed = new Discord.RichEmbed();
    const home = "https://www.codechef.com";
    embed.addField("Problem Link",home+profile.problemUrl)
        .addField("Contest Link",home+profile.contestUrl)
        .addField("Profile Link of Submitter",home+"/users/"+profile.solutionOwnerHandle)
        .setColor(colors[profile.humanReadableResult]);
    
    message.channel.send(embed);

    text.forEach(e => {
        message.channel.send("```"+e+"```");
    });
    
}

exports.info = "Print solution as a text message and it's info\n!codechef solution 'solution-id'";