exports.run = function(client,message){

    message.channel.send("I am going to take nap , will be ready in few moments").then(()=>{
        if(message.author.username === "loki79")
            process.exit(1);
        else{
            message.channel.send("fuck yourself " + msg.author.username);
        }
    });
}