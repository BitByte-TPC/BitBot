const rp = require('request-promise');
const cheerio = require('cheerio');

exports.run = (client,message,args) =>{
    //total number of available memes = 2236
    let rand = (Math.round(Math.random()*10000))%2236;
    if(rand==0){
        message.channel.send("Unlucky day, Sorry!");
        return;
    }
    let options = {
        uri : `https://xkcd.com/${rand}`,
        headers : {
            'User-Agent' : 'Mozilla/5.0'
        }
    }
    rp(options).then(html => {
        const $ = cheerio.load(html);
        let link = $("#comic img").attr('src');
        link = "https:"+link;
        message.channel.send("Your educational meme ===",{
            files:[link]
        });
    }).catch(err => console.error);
}

exports.info = "Fetch a random image from internet, if you are unlucky then return a message";