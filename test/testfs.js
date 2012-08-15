var fs = require('fs');
var iconv = require('iconv-lite');

var result=fs.readFileSync("test/chinese.js");
console.log(iconv.decode( result.toString(),"gbk"));

result=fs.readFileSync("test/testchinese.js");
console.log(result.toString());