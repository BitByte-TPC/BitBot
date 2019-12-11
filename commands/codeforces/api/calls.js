const cheerio = require('cheerio');
const rp = require('request-promise');
const _ = require('lodash');

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
    });
};

exports.getDataOfUser = (args,callback) => {

    let url = `https://codeforces.com/api/user.info?handles=${args.join(";")}`;
    let option = {
        uri : url,
        headers : {
            "Host" : "codeforces.com",
            "User-Agent" : "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"
        }
    };

    rp(option).then(data => {
        let obj = JSON.parse(data);
        if(obj.status != "OK")
            return;
        let main = obj.result;
        let json_data = [];
        main.forEach((element) => {
            json_data.push({
                handle : element.handle,
                rating : element.rating,
                maxRating : element.maxRating,
                rank : element.rank,
                maxRank : element.maxRank,
                iconURL : "https:"+element.titlePhoto
            });
        });
        // console.log(json_data);
        callback(json_data);
    });
};

exports.getRandomQuestion = (callback) => {
    let url = `https://codeforces.com/api/problemset.problems?tags=implementation`;
    let option = {
        uri : url,
        headers : {
            "Host" : "codeforces.com",
            "User-Agent" : "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"
        }
    };

    rp(option).then(data => {
        let json = JSON.parse(data).result.problems;
        json = json[Math.floor(Math.random() * json.length)];

        callback(json);

    })
}

exports.getStatus = (user,callback) => {
    let url = `https://codeforces.com/api/user.status?handle=${user}&from=1&count=1`;
    let option = {
        uri : url,
        headers : {
            "Host" : "codeforces.com",
            "User-Agent" : "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"
        }
    };

    rp(option).then(data => {
        const json = JSON.parse(data).result[0];
        let obj = {
            cid : json.problem.contestId,
            index : json.problem.index,
            verdict : json.verdict,
            time : json.creationTimeSeconds
        };
        callback(obj);
    });
}