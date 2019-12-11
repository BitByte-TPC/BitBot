exports.run = (client,message,args) => {
    let member = message.mentions.members.first();

    let roleN = args.shift();
    //set role var to given role id if it exists in the guild if it doesn't sets null
    let role = message.guild.roles.find(r => r.name === "Competitive Programmer");

    if(!role) message.channel.send("Role not found in the Guild");
    else{
        member.addRole(role).catch(console.error);
        message.channel.send(`Role added to ${roleN}, be responsible!`);
    }
}

//sets help parameter for help command 
