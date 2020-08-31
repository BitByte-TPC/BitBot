exports.run = async (bot, msg, year) => {

    if (isNaN(year)) {
        msg.channel.send("Invalid argument, Enter command as `-batch 2017`");
        return;
    }
    if (!msg.guild) {
        return;
    }

    let roles = msg.member.roles;
    if (roles.find(r => r.name.match(/Batch [0-9]{4}/))) {
        msg.channel.send("You can't get multiple Batch roles.");
        return;
    }

    let batchRole = "Batch " + year;
    let role = msg.guild.roles.find(r => r.name == batchRole);

    console.log(batchRole);
    if (!role) {
      role = await msg.guild.createRole({
            name: batchRole,
        }).catch(console.error);
    }

    msg.member.addRole(role).catch(console.error);
    msg.channel.send(`\`${batchRole}\` role added for user ${msg.member.user}`);
    
}

exports.info = "Get your batch role";