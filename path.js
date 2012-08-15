// var spider = require('./path_spider');
var spider = require('./path_site');
var cf  = require("cloudfoundry");
var mongoose = require("mongoose"),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    DocumentObjectId = mongoose.Types.ObjectId;

var TickerEvent = new Schema({              // Mongoose Models
    symbol: { type: String },
    price: { type: Number },
    volume: { type: Number }
});
mongoose.model('TickerEvent', TickerEvent);
var TickerSummary = new Schema({
    _id: { type: String },
    timestamp: { type: Number },
    max: { type: Number },
    min: { type: Number },
    average: { type: Number },
    volume: { type: Number }
});
mongoose.model('TickerSummary', TickerSummary);
var mongoConfig = cf.getServiceConfig("ticker-analysis");
var db = mongoose.createConnection("mongo://" + mongoConfig.username + ":" +
    mongoConfig.password + "@" + mongoConfig.hostname + ":" + mongoConfig.port + "/" + mongoConfig.db);

exports.init=function(server){
        server.get('/echo/:name', function (req, res, next) {
          res.send(req.params);
          return next();
        });
        server.get('/spider/:site/:type',spider.site);
        server.get("/summary/:symbol", function(req, resp) {
            var TickerSummary = db.model("TickerSummary", "tickersummary");
            TickerSummary.findById(req.params.symbol, function(err, data) {
                if(err) {
                    throw(err);
                }
                // util.debug("params: "+JSON.stringify(data));
                resp.send(JSON.stringify(data));
            });
        });
}