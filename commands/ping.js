exports.run = (client,message,args) =>{
    message.channel.send("Pong bitches!").catch(console.error);
}

exports.info = "Ping the user";