var cheerio = require('cheerio'),request = require('request'),iconv = require('iconv-lite'),http = require("http"),fs=require("fs");
var mongodbConfig = require('../../init/mongodbConfig'),mongourl = mongodbConfig.mongourl,mongodb = mongodbConfig.mongodb;


exports.init=function(req,res,next){
        switch(req.params.type){
            case 'realgfporn': realgfporn(req,res,next);break;
            case 'getrealgfporn': getrealgfporn(req,res,next);break;
            default : res.send('request type name is:'+req.params.type);
        }
        return next();
};
var getrealgfporn=function(request,response,next){
        var page=request.params.page;
        var options = {
            host: 'www.realgfporn.com',
            port: 80,
            path: page.replace("__","/").replace("__","/"),
            method: 'GET'
        };
        console.log(JSON.stringify(options))
        var req = http.request(options, function(res) {
            if(res.statusCode==200){
                var result = '';
                res.on('data', function (chunk) {
                    console.log(chunk)
                    var $ = cheerio.load(chunk) ;
                    var player=$("#player");
                    result=player.html();
                    console.log(result)
                    var pre=result.indexOf("http:");
                    var end=result.indexOf("'",pre);
                    result=result.substring(pre,end);
                });
                res.on("end",function(){
                    response.setHeader("Content-Type", "text/plain; charset=UTF-8");
                    response.write(result);
                    response.end();
                })
            }
        });
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
        req.end();
};
var realgfporn=function(request,response,next){
        var page=request.params.page;
        console.log(page)
        var options = {
            host: 'www.realgfporn.com',
            port: 80,
            path: '/videos/page_'+page+'.html',
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
                        if(count<5)
                                result.push({count:count++,title:title,url:'http://localhost:3003/spider/porn/getrealgfporn/'+(href+"").replace("http://www.realgfporn.com","").replace("/","__").replace("/","__"),imgsrc:imgsrc});
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
};
