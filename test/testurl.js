var querystring = require('querystring')
var dict = { 'q': 'what\'s up' };
console.log(querystring.stringify(dict))
var url = 'http://google.com/?q=' + querystring.stringify(dict);
url = encodeURIComponent(url);
url = url.replace(/'/g,"%27");
console.log(url);
