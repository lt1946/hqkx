var cheerio = require('cheerio'),request = require('request'),iconv = require('iconv-lite'),http = require("http"),fs=require("fs");
var mongodbConfig = require('../../init/mongodbConfig'),mongolab1url = mongodbConfig.mongolab1url,db = mongodbConfig.db;
var async = require('async');

exports.init=function(req,res,next){
        switch(req.params.type){
            case 'realgfporn': realgfporn(req,res,next);break;
            case 'getrealgfporn': getrealgfporn(req,res,next);break;
            case 'getOneRealgfporn': getOneRealgfporn(req,res,next);break;
            case 'getRealgfPornVideo': getRealgfPornVideo(req,res,next);break;
            default : res.send('request type name is:'+req.params.type);
        }
        return next();
};
var getRealgfPornVideo=function(request,response,next){
        var page=request.params.page;
        var options = {
            host: 'www.realgfporn.com',
            port: 80,
            path: "/"+page.replace("___","/"),
            method: 'GET'
        };
        console.log(JSON.stringify(options))
        var req = http.request(options, function(res) {
            // console.log('HEADERS: ' + JSON.stringify(res.headers.Location));
            if(res.headers.Location==undefined&&res.statusCode==200){
                var result = '';
                var start=";so.addVariable('file','";
                res.on('data', function (chunk) {
                    var $ = cheerio.load(chunk) ;
                    var script=$("script");
                    script.each(function(){
                            if(result!='')return;
                            var data=$(this).text();
                            var si = data.indexOf(start);
                            if (si != -1) {
                               result= data.substring(si+start.length,data.indexOf("'", si+start.length));
                            }
                            console.log(result);
                    })
                });
                res.on("end",function(){
                    response.setHeader("Content-Type", "text/html; charset=UTF-8");
                    response.write("<a href='"+result+"' target=_blank>"+result+"</a>");
                    response.end();
                })
            }
        });
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
        req.end();
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
                res.on('data', function (chunk) {
                    var $ = cheerio.load(chunk) ;
                    var post=$(".post");
                    post.each(function(){
                        var $a=$(this).find('a');
                        var href=$a.attr("href");
                        var title=$a.find(".vtitle").text();
                        var imgsrc=$a.find("img").attr("src");
                        var url="http://204.45.123.154:3003/spider/porn/getRealgfPornVideo/"+href.replace("http://www.realgfporn.com/","").replace("/","___");
                        result.push({title:title,url:"<a href='"+url+"' target=_blank>"+url+"</a>",imgsrc:imgsrc});
                    })
                });
                res.on("end",function(){
                    response.setHeader("Content-Type", "text/html; charset=UTF-8");
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
var getOneRealgfporn=function(request,response,next){
    var options = {
        host: 'www.realgfporn.com',
        port: 80,
        path: '/videos/page_'+request.params.page+'.html',
        method: 'GET'
    };
    var result = [];
    var limit_result={};
    async.series([
        function(callback){
            setTimeout(function(){      //series1
                var req = http.request(options, function(res) {
                       if(res.statusCode==200){
                            res.on('data', function (chunk) {
                                var $ = cheerio.load(chunk) ;
                                var post=$(".post");
                                post.each(function(){
                                        var $a=$(this).find('a');
                                        var href=$a.attr("href");
                                        var title=$a.find(".vtitle").text();
                                        var imgsrc=$a.find("img").attr("src");
                                        result.push({ 'url': href,'type':"realgfporn",'ts': new Date(),"title":title,"imgsrc":imgsrc })
                                })
                            });
                            res.on("end",function(){
                                    async.series([
                                        function(callback){     //TODO later 
                                            setTimeout(function(){         //series1-1
                                                    // limit_result
                                                /*db.connect(mongolab1url, function(err, conn){   //test if this href is in the urls of collection.
                                                    conn.collection('urls2', function(err, coll){
                                                        coll.find({url:href}, {limit:1}).toArray(function(err, results) {   //find one url in mongolab1.
                                                            if(results.length==1){          //spider next
                                                                console.log("next")
                                                            }else{
                                                                if(result.length<1)result.push({title:title,url:href,imgsrc:imgsrc});
                                                                count=false;        //stop and return;
                                                                console.log("just get one") ;
                                                                db.connect(mongolab1url, function(err, conn){    //insert to urls collection in mongolab1.
                                                                    conn.collection('urls2', function(err, coll){
                                                                        var object_to_insert = { 'url': href,'type':"realgfporn",'ts': new Date() };
                                                                        coll.insert( object_to_insert, {safe:true}, function(err){
                                                                        });
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });
                                                });*/
                                                 console.log("resseriesult1")       
                                                 callback(null, 1);
                                            }, 4);
                                        }
                                    ],
                                    function(err, results){     //series1-end
                                        response.setHeader("Content-Type", "text/plain; charset=UTF-8");
                                        console.log(JSON.stringify(result))
                                        response.write(JSON.stringify(result));
                                        response.end();
                                    });
                            })
                        }
                });
                req.on('error', function(e) {
                    console.log('problem with request: ' + e.message);
                });
                req.end();
                callback(null, 1);
            }, 4);
        }
    ],
    function(err, results){        //series end
    });
};