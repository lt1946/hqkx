var fs = require('fs');
var iconv = require('iconv-lite');

var result=fs.readFileSync("test/chinese.js");
console.log(result.toString());

result=fs.readFileSync("test/testchinese.js");
console.log(result.toString());