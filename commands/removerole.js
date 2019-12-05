exports.run = (client,message,args) => {
    let member = message.mentions.members.first();
    let roleN = args.shift();
    let role = message.guild.roles.find(r => r.name === args.join(" "));
    
    if(message.member.hasPermission("MANAGE_ROLES"))
        if(message.member.roles.some(r=> r.name === args.join(" ")))
            member.removeRole(role).catch(console.error);
    else {
        message.channel.send("Sender doesn't have permission or member does not have the role.");
        return;
    }
}

exports.info = "Remove role of a member of Server\n!removerole @user {role}";