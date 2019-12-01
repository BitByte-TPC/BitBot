exports.run = (client,message,args) => {
    let member = message.mentions.members.first();
    const roleN = args.shift();
    let role = message.guild.roles.find(r => r.name === args.join(" "));
    // console.log(role);
    // console.log(args.join(" "));
    if(!role) message.channel.send("Role not found in the Guild");
    member.addRole(role).catch(console.error);
}

exports.info = "Set roles to a member of Server\n !setrole @user role";