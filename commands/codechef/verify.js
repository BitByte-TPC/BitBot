const Discord = require('discord.js');
const web = require('./scrape/scrap');
const path = require('path');
const base = require(path.join(__dirname,"../database/db_json.js"));
exports.run = async function (client,message,args){
    // const ver = await web.verify(args);
    const question = await web.randomQuestion(); //get's link of the question [.link] and code[.pcode]
    let embed = new Discord.RichEmbed();
    embed.addField("You have 1 min, submit a compilation error to this question",question.link);
    message.channel.send(embed);
    
    // let newTime = Date.now()/1000;
    setTimeout(async function(){
        let _data = await web.verify(args);
        if(_data.pcode == question.pcode && (_data.date =='1' || _data.date == '2') && _data.status == "compilation error"){
            let data = {
                username : message.member.user.tag,
                codechef_handle : args[0],
                codeforces_handle : ""
            };
            if(!base.addUser(data))
                base.updateCCHandle(data.username,args[0]);
            message.channel.send(`Congratulations, you are now verified!`);
        }
        else{
            message.channel.send("It's OK, try again. You are not verified!");
        }
    },1.5*60*1000)


};