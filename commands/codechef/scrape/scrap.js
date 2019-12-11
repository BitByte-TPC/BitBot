const cheerio = require('cheerio');
const rp = require('request-promise');
var phantom = require('phantom');

//getting user data from codechef scraping magic
exports.getData = (username,callback) =>{
    //options for request-promise library
    let options = {
        uri : `https://www.codechef.com/users/${username}`,
        headers :{
            'User-Agent' : 'Mozilla/5.0'
        }
    };
    
    //rp take options and return the html from the url
    rp(options).then(html => {
        const $  = cheerio.load(html); //loads html to $ so that we can access it using jQuery (approximately true!)
        var user ={}; //data about user in dictionary form
        user.username = username;
        user.name = cheerio.text($('div.user-details-container header h2'));
        user.stars = cheerio.text($('.rating-star')).length;
        user.rating = cheerio.text($('.rating-number'));
        user.iconURL = $('div.user-details-container header img').attr('src');
        let colors = {
            1 : "#666666",
            2 : "#1E7D22",
            3 : "#3366CB",
            4 : "#684273",
            5 : "#FFD819",
            6 : "#FF7F00",
            7 : "#C7011A"
        }
        user.color = colors[user.stars];
        user.stars = user.stars + "★";
        user.highRating = cheerio.text($('div.rating-header small')).replace(/\D/g,'');
        
        callback(user); //callback to user same as async await just old

    }).catch(console.error);
};

exports.getSub = async function(id) {
    const instance = await phantom.create();
    const page = await instance.createPage();

    await page.on("onRequestingResource", data => {
        console.info('Requesting',data.url);
    });
    const status = await page.open(`https://www.codechef.com/viewsolution/${id}`)
    console.log(status);

    const content = await page.property('content');
    const $ = cheerio.load(content, {
        normalizeWhitespace : false,
        xmlMode : false,
        decodeEntities : true
    });

    let l = $('div.ns-content script').html();
    let n = l.substr(21);
    const obj = JSON.parse(n.substr(0,n.length -2));

    await instance.exit();

    return obj;
}

exports.verify = async function(id) {
    const instance = await phantom.create();
    const page = await instance.createPage();

    await page.on("onResourceRequest", requestData =>{
		console.info('Requesting',requestData.url);
    });
    
    const status = await page.open(`https://www.codechef.com/users/${id}`);
    console.info(status);

    const content = await page.property('content');
    const $ = cheerio.load(content, {
        decodeEntities : true,
        xmlMode : false,
        normalizeWhitespace : false
    });

    let answer =[];
	$("table.dataTable tbody tr td").each((i,e) => {
		answer.push(e);
	});
    //data about first answer
    let data = $(answer[0]).text();
    // var p = data.match(/(\d{2}):(\d{2}) (\w{2}) (\d{2})\/(\d{2})\/(\d{2})/); //self-made pretty proud
    // if(p[3]=='PM'){
    //     p[1] = 12 + (+p[1]);
    //     p[1] = ''+p[1];
    // }
    // let utcDate = Date.UTC('20'+p[6],p[5]-1,p[4],p[1],p[2])/1000;

    let f={};
    f.date = data.split('')[0];
	f.pcode = $(answer[1]).text(); //problem code
	f.status = $("span",answer[2]).attr("title"); //should produce "compilation error"
    // console.log(data,pcode,qstatus);
    await instance.exit();
    return f;
};

exports.randomQuestion = async function(){
    const instance = await phantom.create();
    const page = await instance.createPage();

    await page.on("onResourceRequest", requestData =>{
		console.info('Requesting',requestData.url);
    });
    
    const status = await page.open(`https://www.codechef.com/problems/easy`);
    console.info(status);    

    const content = await page.property('content');
    const $ = cheerio.load(content);

    //take all links of problem's page
	let arr = [];
	$("table.dataTable tbody tr td div a").each( (i,e) => {
		arr.push($(e).attr('href'));
	});
    // console.log(l);
    var l = {};
    l.link = arr[Math.floor(Math.random() * arr.length)];
    // console.log(l.link);
    l.pcode = l.link.split("/")[2];
    l.link = "https://www.codechef.com"+l.link;
    await instance.exit();

    return l;

}