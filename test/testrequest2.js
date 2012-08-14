var http=require("http");
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var request = require('request');

var options = {
    host: 'www.huanqiukexue.com',
    port: 80,
    path: '/html/newqqkj/newwl/list_87_3.html',
    method: 'GET'
};

var geturl=function(){
    var result="";
    var req = http.request(options, function(res) {
                if(res.statusCode==200){
                    var encode=res.headers["content-type"].split("=")[1];
                    res.on('data', function (chunk) {
                          result += iconv.decode(chunk,encode)  ;
                        /*  var $ = cheerio.load(iconv.decode(chunk,encode)) ;
                          var title=$(".title");
                          var result = [];
                          title.each(function(){
                              var href=$(this).attr("href");
                              var value=  $(this).text();
                              console.log(href+"\n");
                              console.log(value+"\n");
                          })
                        */
                    });
                    res.on("end",function(){
//                        console.log(result);
                        return result;
                    })
                }
            });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();
}
