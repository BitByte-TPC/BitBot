const allowedSelfRoles = ['Competitive Programmer','Developer','Gamer', 'Linux', 'Windows']

exports.run = (client,message,args) => {
    let member = message.member;
    
    let role = message.guild.roles.find(r => r.name.toLowerCase() === args.join(" ").toLowerCase());
    
    if(!role){
        message.channel.send("Role is not found");
        message.channel.send("Available roles are `'Competitive Programmer','Developer','Gamer', 'Linux', 'Windows'`");
        return;
    }

    let action;
    if (member.roles.has(role.id)){
        member.removeRole(role).catch(console.error);
        action = 'removed'
    }
    else{
        member.addRole(role).catch(console.error);
        action = 'added'
    }
    
    message.channel.send(`Role ${role.name} is ${action}`);

}

exports.info = "Get the self roles";