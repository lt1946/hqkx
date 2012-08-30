var fs=require("fs");

/** 显示抓取url列表 **/
exports.init=function(req, res, next){
    var file=fs.readFileSync(__dirname+ "/../../www/history.html");
    res.end(file);
}