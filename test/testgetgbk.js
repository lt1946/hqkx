var cheerio = require('cheerio');
var request = require('request');
var iconv = require('iconv-lite');

var url='http://www.huanqiukexue.com/html/newqqkj/newwl/list_87_3.html';
request(url, function(error, response, body) {
        
        var $ = cheerio.load(body) ;
        var title=$(".title");
        var result = [];
        title.each(function(){
                var href=$(this).attr("href");
                var value=  $(this).html();
                
                value=iconv.decode(value,"gb2312");
                
                console.log(href+"\n");
                console.log(value+"\n");
                process.exit(1);
        })
});
