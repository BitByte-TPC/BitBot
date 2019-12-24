const cheerio = require('cheerio');
const rp = require('request-promise');
const _ = require('lodash');

// exports.getSub = async (link) => {
    
//     // if( !contest || !id) return;
    
//     let option = {
//         uri: link,
//         headers: {
//             'User-Agent': 'Mozilla/5.0'
//         }
//     }
//     let text;
//     let html = await rp(option).catch(console.error);

//     const $ = cheerio.load(html);
//     text = $("pre[id=program-source-text]").text();

//     return text;
// };

exports.getSub = async (link) => {
    let option = {
        uri: link,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    }
    let user = {};
    let html = await rp(option)
    const $ = cheerio.load(html);
    let l = [];
    $("td > a").each((i, e) => l.push($(e).attr('href')));
    user.profile = "https://codeforces.com" + l[0];
    user.problem = "https://codeforces.com" + l[1];
    user.text = $("pre[id=program-source-text]").text();
    return user;
};

exports.getUserInfo = async (handle) => {

    let url = `https://codeforces.com/api/user.info?handles=${handle.join(";")}`;
    let option = {
        uri: url,
        headers: {
            "Host": "codeforces.com",
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"
        },
    };

    let data = await rp(option)

    let obj = JSON.parse(data);

    if (obj.status != "OK")
        return;
    
    // obj.result.forEach(data => {
    //   user.iconURL = 'https:' + user.avatar 
    //   user.color = getColorFromRank[user.rank]  
    // })
    // let user = obj.result;
    // user.iconURL = 'https:' + user.avatar 
    // user.color = getColorFromRank[user.rank]
    return obj.result;
};

let getColorFromRank = {
    rank: '#color'
}

exports.getRandomQuestion = async () => {
    let url = `https://codeforces.com/api/problemset.problems?tags=implementation`;
    let option = {
        uri: url,
        headers: {
            "Host": "codeforces.com",
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"
        }
    };

    let data = await rp(option)
    let problems = JSON.parse(data).result.problems;
    let problem = problems[Math.floor(Math.random() * problems.length)];

    return problem;
}

exports.getLastSubmission = async (user) => {
    let url = `https://codeforces.com/api/user.status?handle=${user}&from=1&count=1`;
    let option = {
        uri: url,
        headers: {
            "Host": "codeforces.com",
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"
        }
    };

    let data = await rp(option)

    const json = JSON.parse(data).result[0];
    let obj = {
        cid: json.problem.contestId,
        index: json.problem.index,
        verdict: json.verdict,
        time: json.creationTimeSeconds
    };
    return obj;
}

test = async ()=>{
    console.log(await exports.getLastSubmission('janglee123'))
    console.log(await exports.getRandomQuestion())
    console.log(await exports.getUserInfo('janglee123'));
}

// test();