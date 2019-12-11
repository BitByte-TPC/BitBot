const rp = require('request-promise');

exports.run = function(bot,msg){

    let options = {
        uri: 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json',
        json: true
    };

    rp(options).then(function (data) {

        if(!data){
            exports.run(bot,msg);
            return;
        }
        let qt = data.quoteText;
        let author = ' - ' + data.quoteAuthor || '';
        let fullq = `**${qt}** ${author}`;
        msg.channel.send(fullq);

    }).catch(console.error);
}

exports.info = "Get your motivation";
