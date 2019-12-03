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
}
