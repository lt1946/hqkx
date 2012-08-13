var jsdom = require('jsdom');
var request = require('request');
var jquery = 'http://code.jquery.com/jquery-1.7.2.min.js';
// var Iconv = require('iconv').Iconv;
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
                var url='http://www.huanqiukexue.com/html/newqqkj/newwl/list_87_3.html';  
                jsdom.env(url,[jquery],function(err,win){
                        if(err){console.log(err);return;}
                        var $ = win.$;
                        var title=$(".title");
                        var result = [];
                        title.each(function(){
                                var href=$(this).attr("href");
                                var value=$(this).text();
                                value=iconv.decode(value,"gb2312");
                                // var gbk_to_iso_iconv = new Iconv('GBK', 'ISO-8859-1//TRANSLIT//IGNORE');
                                // var iso_buffer = gbk_to_iso_iconv.convert(value);
                                // value=iso_buffer.toString();
// 
                                // var iso_to_utf8_iconv = new Iconv('ISO-8859-1', 'utf8//TRANSLIT//IGNORE');
                                // var utf8_buffer = iso_to_utf8_iconv.convert(value);
                                // value=utf8_buffer.toString();
                                
                                console.log(value);
                                result.push({value:value,url:href}); 
                        });
                         //res.setEncoding('gbk');
                         console.log(JSON.stringify(result))
                        // res.writeHeader(200,{"Content-Type":"text/plain; charset=gbk"})
                        res.send(JSON.stringify(result));
                });
                return next();
        },
        test:function(req,res,next){
                var url='http://www.jqmapi.com/componts/toolbar/Header%20.html';  
                jsdom.env(url,[jquery],function(err,win){
                        if(err){console.log(err);return;}
                        var $ = win.$;
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
