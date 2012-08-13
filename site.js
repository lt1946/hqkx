var cheerio = require('cheerio');
var request = require('request');
var iconv = require('iconv-lite');

exports.site=function (req, res, next) {
          console.log(req.params);
          switch(req.params.site){
                  case 'hqkx': hqkx.init(req,res,next);break;
                  default : res.send('request site name is:'+req.params.site);
          }
          return next();
       };
var hqkx={
        init:function(req,res,next){
                switch(req.params.type){
                  case 'wl': this.type(req,res,next);break;
                  case 'test': this.test(req,res,next);break;
                  default : res.send('request type name is:'+req.params.type);
                }
          return next();
        },
        type:function(req,res,next){
                 res.on('data', function (chunk) {
                    var $ = cheerio.load(iconv.decode(chunk,encode)) ;
                    var title=$(".title");
                    var result = [];
                    title.each(function(){
                        var href=$(this).attr("href");
                        var value=  $(this).text();
                        console.log(href+"\n");
                        console.log(value+"\n");
                        result.push({value:value,url:href}); 
                    })
                    console.log(JSON.stringify(result));
                    res.send(JSON.stringify(result));
                });
/*
                var url='http://www.huanqiukexue.com/html/newqqkj/newwl/list_87_3.html';
                request(url, function(error, response, body) {
                        var $ = cheerio.load(iconv.decode(body,"gb2312")) ;
                        var title=$(".title");
                        var result = [];
                        title.each(function(){
                                var href=$(this).attr("href");
                                var value=  $(this).html();
                                console.log(href+"\n");
                                // value=iconv.decode(value,"gb2312");
                                console.log(value+"\n");
                                
                               result.push({value:value,url:href}); 
                        });
                        console.log(JSON.stringify(result));
                        res.send(JSON.stringify(result));
                });*/

                return next();
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
