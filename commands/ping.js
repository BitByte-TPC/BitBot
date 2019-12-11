exports.run = (client,message,args) =>{
    message.channel.send(new Date().getTime() - message.createdTimestamp + " ms").catch(console.error);
}

exports.info = "Get the ping";