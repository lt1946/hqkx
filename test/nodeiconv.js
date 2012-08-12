var http = require('http');

var options = {
    host: 'www.baidu.com',
    port: 80,
    path: '/s?wd=nodejs'
};

var Iconv = require('iconv').Iconv;

http.get(options, function(res) {
    console.log("Got response: " + res.statusCode, res.headers);
    var buffers = [], size = 0;
    res.on('data', function(buffer) {
        buffers.push(buffer);
        size += buffer.length;
    });
    res.on('end', function() {
        var buffer = new Buffer(size), pos = 0;
        for(var i = 0, l = buffers.length; i < l; i++) {
            buffers[i].copy(buffer, pos);
            pos += buffers[i].length;
        }
        // 'content-type': 'text/html;charset=gbk'
        // 百度返回的页面数据流竟然还无法使用gbk完全解码。。
        var gbk_to_utf8_iconv = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
        var utf8_buffer = gbk_to_utf8_iconv.convert(buffer);
        console.log(utf8_buffer.toString());
    });
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});