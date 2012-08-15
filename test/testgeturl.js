var request=require("request");

var url='http://www.huanqiukexue.com/html/newqqkj/newwl/list_87_3.html';  

request({
        uri : url,
        method : 'GET',
        encoding : 'binary'
}, function(error, response, body) {
        body = new Buffer(body, 'binary');
        conv = new iconv.Iconv('windows-1251', 'utf8');
        body = conv.convert(body).toString();
}); 