var cheerio = require('cheerio'),request = require('request'),iconv = require('iconv-lite'),http = require("http"),fs=require("fs");
var mongodbConfig = require('../../init/mongodbConfig'),mongourl = mongodbConfig.mongourl,db = mongodbConfig.db;
 
exports.getAll=function(req, res, next){        //find pring all ips of collection    
    db.connect(mongourl, function(err, conn){
        conn.collection('ips', function(err, coll){
                 coll.find().toArray(function(err, results) {
                        res.setHeader("Content-Type", "text/plain; charset=UTF-8");
                        res.write(JSON.stringify(results));
                        res.end('\n');
                });
        });
    });
    return next();
};
exports.insert=function(req, res, next){          /** 测试 insert to mongodb and print sql **/               
    console.log(mongourl)
    db.connect(mongourl, function(err, conn){
        conn.collection('ips', function(err, coll){
            var object_to_insert = { 'ip': req.connection.remoteAddress, 'ts': new Date() };
            coll.insert( object_to_insert, {safe:true}, function(err){
                res.setHeader("Content-Type", "text/plain; charset=UTF-8");
                res.write(JSON.stringify(object_to_insert));
                res.end('\n');
            });
        });
    });
    return next();
}