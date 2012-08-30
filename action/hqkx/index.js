var cheerio = require('cheerio'),request = require('request'),iconv = require('iconv-lite'),http = require("http"),fs=require("fs");
var mongodbConfig = require('../../init/mongodbConfig'),mongourl = mongodbConfig.mongourl,db = mongodbConfig.db;


exports.init=function(req,res,next){
        switch(req.params.type){
          case 'wl': type(req,res,next);break;
          case 'test':test(req,res,next);break;
          default : res.send('request type name is:'+req.params.type);
        }
        return next();
}
var type=function(request,response,next){
    var options = {
        host: 'www.huanqiukexue.com',
        port: 80,
        path: '/html/newqqkj/newwl/list_87_3.html',
        method: 'GET'
    };
    var req = http.request(options, function(res) {
        if(res.statusCode==200){
            var encode=res.headers["content-type"].split("=")[1];
            var result = [];
            res.on('data', function (chunk) {
                var $ = cheerio.load(encode.indexOf('utf')>=0?chunk:iconv.decode(chunk,encode)) ;
                var title=$(".title");
                title.each(function(){
                    var href=$(this).attr("href");
                    var value=  $(this).text();
                    console.log(href+"\n");
                    console.log(value+"\n");
                    result.push({value:value,url:href});
                })
            });
            res.on("end",function(){
                response.setHeader("Content-Type", "text/plain; charset=UTF-8");
                response.write(JSON.stringify(result));
                response.end();
            })
        }
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();
}
var test=function(req,res,next){
        var url='http://www.jqmapi.com/componts/toolbar/Header%20.html';
        request(url, function(error, response, body) {
            var $ = cheerio.load(body) ;
            var title=$(".content");
            var result = [];
            title.each(function(){
                    var value=$(this).html();
                   result.push({value:value});
            });
            res.send(JSON.stringify(result));
        });
        return next();
}