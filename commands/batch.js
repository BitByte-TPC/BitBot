exports.run = function (bot, msg, year) {

    if (isNaN(year)) {
        msg.channel.send("invalid argument enter command as `!batch 2017`");
        return;
    }
    if (!msg.guild) {
        return;
    }

    let roles = msg.member.roles;
    if (roles.find(r => r.name.match(/Batch [0-9]{4}/))) {
        msg.channel.send("You can't get multiple Batch roles");
    }

    let batchRole = "Batch " + year;
    let role = msg.guild.roles.find(r => r.name == batchRole);

    console.log(batchRole);
    if (!role) {
        msg.guild.createRole({
            name: batchRole,
        }).catch(console.error);
    }

    msg.member.addRole(role).catch(console.error);
    
}

exports.info = "Get your batch role";