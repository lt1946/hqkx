// var spider = require('./path_spider');
var action = require('./action/action'),
    action_test = require('./action/action_test'),

exports.init=function(server){
    server.get('/echo/:name', echo);
    //action
    server.get('/history',action.history_init);
    server.get('/spider/:site/:type/:page',action.site);
    server.get('/mongodb/:type',action.mongodb);
    //action_test
    server.get('/test/:type',action_test.init);
}                               

var echo=function (req, res, next) {
    res.send(req.params);
    return next();
}