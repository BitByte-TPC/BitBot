const cheerio = require('cheerio');
const rp = require('request-promise');

//getting user data from codechef scraping magic
exports.getData = (username,callback) =>{
    //options for request-promise library
    let options = {
        uri : `https://www.codechef.com/users/${username}`,
        headers :{
            'User-Agent' : 'Mozilla/5.0'
        }
    }
    //rp take options and return the html from the url
    rp(options).then(html => {
        const $  = cheerio.load(html); //loads html to $ so that we can access it using jQuery (approximately true!)
        var user ={}; //data about user in dictionary form
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
        
        callback(user); //callback to user same as async await just old

    }).catch(console.error);
}
//get Solution using solution id
exports.getSub = (num,callback)=>{
    let options = {
        uri : `https://www.codechef.com/viewplaintext/${num}`,
        headers : {
            'User-Agent' : 'Mozilla/5.0'
        }   
    };
    let text;

    rp(options).then(function(html){
        const $ = cheerio.load(html);
        text=cheerio.text($('body pre'));
        callback(text);
    }).catch(console.error);
}
//get user data from solution, in work todo - is added
exports.getUser = (num,callback) => {
    let options = {
        uri : `https://www.codechef.com/viewsolution/${num}`,
        headers : {
            'Host':'www.codechef.com',
            'User-Agent' : 'Mozilla/5.0',
            'Accept' : 'text/html,application/xhtml+xml,application/xml'
        }
    }

    rp(options).then(html => {
        const $ = cheerio.load(html);
        let user = {};
        user.contest = "https:"+$('span.contest-code strong a').attr('href');
        user.problem = "https:"+$('span.problem-code strong a').attr('href');
        user.profile = "https:"+$('span.user-name strong a').attr('href');
        callback(user);
    })
}