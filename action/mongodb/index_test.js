var cheerio = require('cheerio'),request = require('request'),iconv = require('iconv-lite'),http = require("http"),fs=require("fs");
var mongodbConfig = require('../../init/mongodbConfig'),mongolab1url = mongodbConfig.mongolab1url,db = mongodbConfig.db;
 
  //find pring all ips of collection    
exports.getAll=function(req, res, next){        
    db.connect(mongolab1url, function(err, conn){
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
    /** 测试 insert to mongodb and print sql **/               
exports.insert=function(req, res, next){
    db.connect(mongolab1url, function(err, conn){
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
};
