// var spider = require('./path_spider');
var spider = require('./path_site');

exports.init=function(server){
        server.get('/echo/:name', function (req, res, next) {
          res.send(req.params);
          return next();
        });
        server.get('/spider/:site/:type',spider.site);
}
