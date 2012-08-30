var hqkx=require("./hqkx/index"),porn=require("./porn/index"),mongodb=require("./mongodb/index"),history=require("./history/index");
/** 抓取站点 **/
exports.site=function (req, res, next) {
    console.log(JSON.stringify(req.params));
    switch(req.params.site){
          case 'hqkx': hqkx.init(req,res,next);break;
          case 'porn': porn.init(req,res,next);break;
          default : res.send('request site name is:'+req.params.site);
    }
    return next();
};
/** mongodb **/
exports.mongodb=function (req, res, next) {
    console.log(JSON.stringify(req.params));
    switch(req.params.type){
            case 'insert': mongodb.insert(req,res,next);break;
            case 'getAll': mongodb.getAll(req,res,next);break;
            default : res.send('request type name is:'+req.params.type);
    }
    return next();
};
/** history.html **/
exports.history_init=function (req, res, next) {
    history.init(req, res, next);
}
