const web = require("./api/calls");
const Discord = require('discord.js');
const path = require('path');
const base = require(path.join(__dirname,"../database/db_json.js"));

exports.run = (client,message,args) => {
    // var timeWhenQuestionIsPut;
    // let data;
    if(base.getUserByCFHandle(args[0]))
        message.channel.send("You have been already verified for Codeforces!");
    else{
    let gdata = {}
    web.getRandomQuestion(json => {
    let embed = new Discord.RichEmbed();
    gdata.data = json;
    let link = `https://codeforces.com/contest/${json.contestId}/problem/${json.index}`;
    embed.addField("You have 1 minute, submit a comilation error to the question",link);
    message.channel.send(embed);
    gdata.timeWhenQuestionIsPut = Date.now()/1000;
    });
    setTimeout(()=> {
        web.getStatus(args, status=> {
            // console.log(args);
            let data = {
                username : message.member.user.tag,
                codechef_handle : "",
                codeforces_handle : args[0]
            };
            if(status.cid == gdata.data.contestId && status.index == gdata.data.index && status.time - gdata.timeWhenQuestionIsPut <= 60 && status.verdict == "COMPILATION_ERROR"){
                

                if(!base.addUser(data))
                    base.updateCFHandle(data.username,args[0]);
                message.channel.send(`Congratulations, ${data.username.split("#")[0]} is now verified!\nYour role will be added soon!`);
                web.getDataOfUser(args, user => {
                    // let role = message.guild.roles.find(r => r.name === user.rank);
                    let ranks = ["pupil","specialist","expert","candidate master","master","international master","grandmaster","international grandmaster","legendary grandmaster"];
                    let roles = message.member.roles; //list of role member have
                    // let role = message.guild.roles.find('name',user[0].rank); 
                    let role = message.guild.roles.find(r=> r.name == user[0].rank);
                    ranks.forEach(e => {
                        let check = roles.find( r=> r.name == e);
                        // let check = roles.find('name',e);
                        if(check)
                            message.member.removeRole(check);
                    });
                    if(!role)
                        message.channel.send(`Guild doesn't have ${user[0].rank} role`);
                    else {
                        message.member.addRole(role);
                    }
                    
                });
            }
            else{
                message.channel.send(`It's OK, try again. ${data.username} is not verified!`);
            }
        })
    },60*1000);
}    
};

exports.info = "Verification for codeforces and role add"