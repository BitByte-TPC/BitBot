const cheerio = require('cheerio');
const rp = require('request-promise');

exports.getSub = (num,callback) => {
    //console.log(num);
    let option = {
        uri : `http://codeforces.com/contest/${num[0]}/submission/${num[1]}`,
        headers :{
            'User-Agent' : 'Mozilla/5.0'
        }
    }
    let text;
    rp(option).then(html=>{
        const $ = cheerio.load(html);
        text = $("pre[id=program-source-text]").text();
        callback(text);
    }).catch(console.error);
};

exports.getUser = (num,callback) => {
    let option = {
        uri : `https://codeforces.com/contest/${num[0]}/submission/${num[1]}`,
        headers :{
            'User-Agent' : 'Mozilla/5.0'
        }
    }
    let user ={};
    rp(option).then(html => {
        const $ = cheerio.load(html);
        let l =[];
        $("td > a").each((i,e) => l.push($(e).attr('href')));
        user.profile = "https://codeforces.com"+l[0];
        user.problem = "https://codeforces.com"+l[1];
        callback(user);
    })
};

exports.getData = (args, callback) => {
    let url = `https://codeforces.com/profile/${args}`;
    let option = {
        uri : url,
        headers : {
            'User-Agent' : 'Mozilla/5.0'
        }
    };

    rp(option).then(html => {
        const $ = cheerio.load(html);
        let user = {};
        user.profile_name = $("h1 > a").text(); //Profile name
        user.profile_rank = $("div[class=user-rank] span").text(); //Profile rank
        let l = [];
        $("div[class=info] ul li span").each((i,e) => l.push($(e).text()));
        // l[0] - rating, l[2] - rank, l[3] - highest rating
        user.high_rank = l[2].replace(',','');
        user.rating = l[0];
        user.high_rating = l[3];
        user.iconURL = "https:"+$("div[class=title-photo] div div div img").attr('src');
        user.url = url;
        user.name = args;
        callback(user);

    }).catch(console.error);
};
