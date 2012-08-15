var http=require("http");
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

var options = {
  host: 'www.huanqiukexue.com',
  port: 80,
  path: '/html/newqqkj/newwl/list_87_3.html',
  method: 'GET'
};
exports.test=function(){
        var req = http.request(options, function(res) {
            if(res.statusCode==200){
                var encode=res.headers["content-type"].split("=")[1];
                res.on('data', function (chunk) {
                    var $ = cheerio.load(iconv.decode(chunk,encode)) ;
                    var title=$(".title");
                    var result = [];
                    title.each(function(){
                        var href=$(this).attr("href");
                        var value=  $(this).text();
                        console.log(href+"\n");
                        console.log(value+"\n");
                    })
                    // console.log('BODY: ' + iconv.decode(chunk,"gb2312"));
                });
            }
        //  console.log('STATUS: ' + res.statusCode);
        //  console.log('HEADERS: ' + JSON.stringify(res.headers));
        //  console.log('encoding:'+res.headers["content-type"].split("=")[1])
        });
        req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
        });
        // write data to request body
        req.write('data\n');
        req.write('data\n');
        req.end();
}
