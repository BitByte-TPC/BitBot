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
};

//get Solution using solution id
// exports.getSub = (num,callback)=>{
//     let options = {
//         uri : `https://www.codechef.com/viewplaintext/${num}`,
//         headers : {
//             'User-Agent' : 'Mozilla/5.0'
//         }   
//     };
//     let text;

//     rp(options).then(function(html){
//         const $ = cheerio.load(html);
//         text=cheerio.text($('body pre'));
//         callback(text);
//     }).catch(console.error);
// };

//get user data from solution, in work todo - is added work on halt, raise a pr if you needed
// exports.getUser = (num,callback) => {
//     let options = {
//         method : 'GET',
//         uri : `https://www.codechef.com/viewsolution/${num}`,
//         headers : {
//             'Host':'www.codechef.com',
//             'User-Agent' : 'Mozilla/5.0',
//             'Accept' : 'text/html,application/xhtml+xml,application/xml'
//         }
//     }

//     rp(options).then(html => {
//         const $ = cheerio.load(html);
//         let user = {};
//         let ref = [];
//         $('div.breadcrumb > a').each((i,e)=>{
//             ref.push($(e).attr('href'));
//         });

//         let ar = $('div.breadcrumb').text();
// 	    let profile_name = ar.substr(39).split(" ")[0];
//         user.profile = "https://www.codechef.com/users/"+profile_name;
//         user.problem = "https://www.codechef.com/"+ref[1];
//         callback(user);
//     });
// };

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
