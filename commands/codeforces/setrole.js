const cf = require("./api/calls");
const Discord = require('discord.js');
const path = require('path');
const base = require(path.join(__dirname, "../database/db_json.js"));

exports.run = async (client, message, args) => {

    let handle = args[0];
    //check is user is veriferd or not
    if (base.getUserByCFHandle(handle)) {
        message.channel.send("Your rank will be updated!");
        setRole(message.member, handle, message);
    }
    else {
        
        let problem = await cf.getRandomQuestion();
        
        let embed = new Discord.RichEmbed();
        let link = `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`;
        embed.addField("You have 1 minute, submit a comilation error to the question", link);
        message.channel.send(embed);
        
        let gdata = {
            data: problem,
            timeWhenQuestionIsPut: Date.now() / 1000,
        }

        setTimeout( async () => {
            let status = await cf.getLastSubmission(handle);
            
            let data = {
                username: message.member.user.tag,
                codechef_handle: "",
                codeforces_handle: handle
            };

            if (status.cid == gdata.data.contestId
                && status.index == gdata.data.index
                && status.time - gdata.timeWhenQuestionIsPut <= 60) {
                    
                if (!base.addUser(data))
                    base.updateCFHandle(data.username, handle);
                    
                message.channel.send(`You are verifed now, ${message.member}!\nYour role will be added soon.`);
                setRole(message.member, handle, message);
            }
            else {
                message.channel.send(`It's OK, try again. ${message.member} is not verified!`);
            }
            
        }, 60 * 1000);
    }
};

let setRole = async (member, handle, message) => {

    let info = await cf.getUserInfo(handle);

    let ranks = ["pupil", "specialist", "expert", "candidate master", "master", "international master", "grandmaster", "international grandmaster", "legendary grandmaster"];
    let roles = member.roles;

    let newRank = info.rank;
    let rankRole = roles.find(r => r.name.toLowerCase() in ranks)

    //remove old rank
    if (rankRole) {
        member.removeRole(rankRole);
    }
    //add new rank role
    let newRankRole = member.guild.roles.find(r => r.name.toLowerCase() == newRank);

    if (!newRankRole)
        message.channel.send('Rank role not found!');
    else {
        member.addRole(newRankRole);
        return true;
    }

}

exports.info = "Get your codeforces rank role"