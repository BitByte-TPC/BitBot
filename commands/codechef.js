//Driver file for codechef command

const fs = require('fs');
const enmap = require('enmap');

const ccommand = new enmap();

fs.readdir('./commands/codechef/',(err,File)=>{
    if(err) console.log(err);

    File.forEach(file=>{
        if(!file.endsWith('.js')) return;

        let cfile = require(`./codechef/${file}`);
        let cname = file.split('.')[0];
        console.log(`Loading command ${cname}`);

        ccommand.set(cname,cfile);
    })
})

exports.run = (client,message,args)=>{
    const cmd = ccommand.get(args.shift());

    if(!cmd){
        message.channel.send("Can't find this command");
        return;
    }
    cmd.run(client,message,args);
}

exports.info = "Commands related to codechef, please respect.";