const Discord = require('discord.js');
const web = require('./scrape/scrap');
const path = require('path');
const base = require(path.join(__dirname,"../database/db_json.js"));
exports.run = async function (client,message,args){
    // const ver = await web.verify(args);
    if(base.getUserByCCHandle(args[0]))
        message.channel.send("You have been already verified for Codechef!");
    else{    
    const question = await web.randomQuestion(); //get's link of the question [.link] and code[.pcode]
    let embed = new Discord.RichEmbed();
    embed.addField("You have 1 min, submit a compilation error to this question",question.link);
    message.channel.send(embed);
    
    // let newTime = Date.now()/1000;
    setTimeout(async function(){
        let _data = await web.verify(args);
        let data = {
            username : message.member.user.tag,
            codechef_handle : args[0],
            codeforces_handle : ""
        };
        if(_data.pcode == question.pcode && (_data.date =='1' || _data.date == '2') && _data.status == "compilation error"){
            
            if(!base.addUser(data))
                base.updateCCHandle(data.username,args[0]);
            message.channel.send(`Congratulations, ${data.username.split("#")[0]} is now verified!\nYour role will be added soon.`);
            web.getData(args, user => {
                let roleString = "codechef " +user.stars
                let roles = message.member.roles; //list of role member have
                let role = message.guild.roles.find(r => r.name === roleString); //role that will be added

                if(roles.find(`name`,roleString)){
                    return;
                }
                //removing other star roles
                for(var i = 1 ; i < 8 ; i++ ){
                    let check = roles.find(r => r.name === `codechef ${i}★`);
                    // let check = roles.find('name',`codechef ${i}★`);
                    if(check){
                        message.member.removeRole(check);
                    }
                }

                if(role){
                    message.member.addRole(role);
                }
                else {
                    message.channel.send(`Guild doesn't have ${user.rank} role`);
                }
            });
        }
        else{
            message.channel.send(`It's OK, try again. ${data.username} is not verified!`);
        }
    },1.5*60*1000);
}

};

exports.info = "Verification for codechef and role add"
