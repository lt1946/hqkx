var spider = require('./spider');
// var spider = require('./site');

exports.init=function(server){
        server.get('/echo/:name', function (req, res, next) {
          res.send(req.params);
          return next();
        });
        server.get('/spider/:site/:type',spider.site);
}
