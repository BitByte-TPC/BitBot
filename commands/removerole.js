exports.run = (client,message,args) => {
    let member = message.mentions.members.first();
    let roleN = args.shift();
    let role = message.guild.roles.find(r => r.name === args.join(" "));
    
    if(message.member.roles.some(r=> r.name === args.join(" ")))
        member.removeRole(role).catch(console.error);
    else
        message.channel.send("Member doesn't have this role");
}

exports.info = "Remove role of a member of Server\n!removerole @user role";