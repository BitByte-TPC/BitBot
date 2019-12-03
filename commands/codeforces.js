//Driver file for codeforces command
const Discord = require('discord.js');
const fs = require('fs');
const enmap = require('enmap');

const cf = new enmap();

fs.readdir('./commands/codeforces/',(err,File)=>{
    if(err) console.log(err);

    File.forEach(file=>{
        if(!file.endsWith('.js')) return;

        let cfile = require(`./codeforces/${file}`);
        let cname = file.split('.')[0];
        console.log(`Loading command ${cname}`);
        cf.set(cname,cfile);
    })
})

exports.run = (client,message,args)=>{
    
    const cmd = cf.get(args.shift());

    if(!cmd){
        let embed = new Discord.RichEmbed();
        for(const [cmd,file] of cf.entries()){
            if(file.info)
                embed.addField(cmd,file.info);
        }
        message.channel.send(embed);
        return;
    }
    cmd.run(client,message,args);
}

exports.info = "Commands related to codeforces.\nUse only codeforces for commands";