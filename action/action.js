var cheerio = require('cheerio');
var request = require('request');
var iconv = require('iconv-lite');
var http = require("http");
var mongourl = require('../init/mongourl');
var mongodb = require('mongodb');
var fs=require("fs");

/** 测试mongodb **/
exports.mongodbtest=function(req, res, next){
    console.log(mongourl)
    mongodb.connect(mongourl, function(err, conn){
        conn.collection('ips', function(err, coll){
            object_to_insert = { 'ip': req.connection.remoteAddress, 'ts': new Date() };
            coll.insert( object_to_insert, {safe:true}, function(err){
                res.setHeader("Content-Type", "text/plain; charset=UTF-8");
                res.write(JSON.stringify(object_to_insert));
                res.end('\n');
            });
        });
    });
    return next();
}
/** 显示抓取url列表 **/
exports.history=function(req, res, next){
    var file=fs.readFileSync(__dirname+ "/../www/history.html");
    res.end(file);
}
/** 抓取站点 **/
exports.site=function (req, res, next) {
  console.log(req.params);
  switch(req.params.site){
          case 'hqkx': hqkx.init(req,res,next);break;
          case 'porn': porn.init(req,res,next);break;
          default : res.send('request site name is:'+req.params.site);
  }
  return next();
};
var porn={
    init:function(req,res,next){
        switch(req.params.type){
            case 'realgfporn': this.realgfporn(req,res,next);break;
            case 'getrealgfporn': this.getrealgfporn(req,res,next);break;
            default : res.send('request type name is:'+req.params.type);
        }
        return next();
    },
    getrealgfporn: function(request,response,next){
        var page=request.params.page;
        console.log(page)
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
    },
    realgfporn: function(request,response,next){
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
    }
}
var hqkx={
        init:function(req,res,next){
                switch(req.params.type){
                  case 'wl': this.type(req,res,next);break;
                  case 'test': this.test(req,res,next);break;
                  default : res.send('request type name is:'+req.params.type);
                }
          return next();
        },
        type: function(request,response,next){
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
        },
        test:function(req,res,next){
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
}
