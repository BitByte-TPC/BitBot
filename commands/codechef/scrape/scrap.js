const cheerio = require('cheerio');
const rp = require('request-promise');

exports.getData = (username,callback) =>{
    let options = {
        uri : `https://www.codechef.com/users/${username}`,
        headers :{
            'User-Agent' : 'Mozilla/5.0'
        }
    }
    rp(options).then(html => {
        const $  = cheerio.load(html);
        var user ={};
        user.username = username;
        user.name = cheerio.text($('div.user-details-container header h2'));
        user.stars = cheerio.text($('.rating-star')).length;
        user.rating = cheerio.text($('.rating-number'));
        user.iconURL = $('div.user-details-container header img').attr('src');
        if(user.stars==1)user.color = "#666666";
        else if(user.stars==2)user.color = "#1E7D22";
        else if(user.stars==3)user.color = "#3366CB";
        else if(user.stars==4)user.color = "#684273";
        else if(user.stars==5)user.color = "#FFD819";
        else if(user.stars==6)user.color = "#FF7F00";
        else if(user.stars==7)user.color = "#C7011A";
        user.highRating = cheerio.text($('div.rating-header small')).replace(/\D/g,'');
        //console.log(user);
        callback(user);

    }).catch(console.error);

}