// var spider = require('./path_spider');
var action = require('./action/action');

exports.init=function(server){
        server.get('/echo/:name', function (req, res, next) {
          res.send(req.params);
          return next();
        });
        server.get('/spider/:site/:type',action.site);
        server.get('/mongodb/test',action.mongodbtest);
}
