exports.run = (client,message,args) => {
    message.channel.send({embed : {
        author : {
            name : client.user.username,
            icon_url : client.user.avatarURL
        },
        title : "This is your help",
        url : "https://www.github.com/get-thepacket/Js-Test",
        description : "Commands for the called upon bot of the server",
        fields : [{
            name :"ping",
            value :"Pong it man!"
        },{
            name : "help",
            value :" Shows the help page of the bot"
        }]

    }}).catch(err => console.log(err));
}