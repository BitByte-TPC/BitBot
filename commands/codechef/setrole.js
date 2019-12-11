const Discord = require('discord.js');
const cc = require('./scrape/scrap');
const path = require('path');
const base = require(path.join(__dirname, "../database/db_json.js"));

exports.run = async function (client, message, args) {
    
    let handle = args[0];

    if (base.getUserByCCHandle(handle)) {
        message.channel.send("Your rank will be updated");
        setRole(message.member, handle);
        return;
    }

    const question = await cc.randomQuestion(); 
    let embed = new Discord.RichEmbed();
    embed.addField("You have 1 min, submit a compilation error to this question", question.link);
    message.channel.send(embed);

    setTimeout(async function () {
        let submission = await cc.getLastSubmission(handle);

        let data = {
            username: message.member.user.tag,
            codechef_handle: args[0],
            codeforces_handle: ""
        };

        if (submission.pcode == question.pcode) {
            if (!base.addUser(data)){
                base.updateCCHandle(data.username, handle);
            }

            message.channel.send(`You are now verified, ${message.member}!\nYour role will be added soon.`);
            setRole(message.member, handle);
        }
        else {
            message.channel.send(`It's OK, try again. ${message.member} is not verified!`);
        }
    }, 60 * 1000);
};


let setRole = async (member, id) => {
    let user = await cc.getUserInfo(id);
    let newRole = 'Codechef ' + user.stars;

    let roles = member.roles;
    oldRole = roles.find(r => r.name.startsWith('Codechef'))

    if (oldRole) {
        member.removeRole(oldRole);
    }

    let role = member.guild.roles.find(r => r.name == newRole);
    if (!role) {
        return;
    }
    member.addRole(role);
}

exports.info = "Verification for codechef and role add"
