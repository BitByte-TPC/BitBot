exports.run = (client,message,args) => {
    let member = message.mentions.members.first();
    let roleN = args.shift();
    let role = message.guild.roles.find(r => r.name === "Competitive Programmer");
    // console.log(role);
    if(!role) message.channel.send("Role not found in the Guild");
    member.addRole(role).catch(console.error);
}

exports.info = "Set Competitive Programmer as a Role to a member of Codechef";