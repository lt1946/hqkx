var cheerio = require('cheerio'),request = require('request'),iconv = require('iconv-lite'),http = require("http");

//TODO sync get is function
exports.getrealgfporn=function(){
    var options = {
        host: 'www.realgfporn.com',
        port: 80,
        path: '/videos/page_1.html',
        method: 'GET'
    };
    var req = http.request(options, function(res) {
        if(res.statusCode==200){
            var result = [];
            var count=1;
            res.on('data', function (chunk) {
                var $ = cheerio.load(chunk) ;
                var post=$(".post");
                post.each(function(){
                    var $a=$(this).find('a');
                    var href=$a.attr("href");
                    var title=$a.find(".vtitle").text();
                    var imgsrc=$a.find("img").attr("src");
                    console.log(href+"\n");
                    console.log(title+"\n");
                    console.log(imgsrc+"\n");
                    result.push({count:count++,title:title,url:href,imgsrc:imgsrc});
                })
            });
            res.on("end",function(){
                  return result;
            })
        }
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();
};