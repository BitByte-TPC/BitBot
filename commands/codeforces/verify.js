const web = require("./api/calls");
const Discord = require('discord.js');
const path = require('path');
const base = require(path.join(__dirname,"../database/db_json.js"));

exports.run = (client,message,args) => {
    // var timeWhenQuestionIsPut;
    // let data;
    let gdata = {}
    web.getRandomQuestion(json => {
    let embed = new Discord.RichEmbed();
    gdata.data = json;
    let link = `https://codeforces.com/contest/${json.contestId}/problem/${json.index}`;
    embed.addField("You have 1 minute, submit a comilation error to the question",link);
    message.channel.send(embed);
    gdata.timeWhenQuestionIsPut = Date.now()*1000;
    });

    setTimeout(()=> {
        web.getStatus(args, status=> {
            // console.log(args);
            if(status.cid == gdata.data.contestId && status.index == gdata.data.index && status.time - gdata.timeWhenQuestionIsPut <= 60 && status.verdict == "COMPILATION_ERROR"){
                let data = {
                    username : message.member.user.tag,
                    codechef_handle : "",
                    codeforces_handle : args[0]
                };

                let ans = base.addUser(data);
                if(!ans)
                    base.updateCFHandle(data.username,args[0]);
                message.channel.send(`Congratulations, you are now verified!`);     
            }
            else{
                message.channel.send(`It's OK, try again. You are not verified!`);
            }
        })
    },60*1000);
    
};