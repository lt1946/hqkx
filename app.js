var restify = require('restify'),path = require('./path');

var port = (process.env.VMC_APP_PORT || 3003);
var host = (process.env.VCAP_APP_HOST || 'localhost');

var server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

path.init(server);

server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});
