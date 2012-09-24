var index_test=require("./mongodb/index_test");

/**
 *test mongodb
 */
exports.init=function(req,res,next){                 //switch type
  switch(req.params.type){
          case 'getAll_mongodb': index_test.getAll(req,res,next);break;
          case 'insert_mongodb': index_test.insert(req,res,next);break;
          case 'getOneUrl': index_test.getOneUrl(req,res,next);break;
          case 'insertOneUrl' :index_test.insertOneUrl(req,res,next);break;
          default : res.send('request type name is:'+req.params.type);
  }
  return next();
}
