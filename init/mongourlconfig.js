/**
 * Created with JetBrains WebStorm.
 * User: IATBFOREVER
 * Date: 12-8-16
 * Time: 下午9:34
 * To change this template use File | Settings | File Templates.
 */
if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    console.log(JSON.stringify(env['mongodb-1.8']))
    console.log(env['mongodb-1.8'].length)
    var mongo = env['mongodb-1.8'][0]['credentials'];
}else{
    var mongo = {
        "hostname":"localhost",
        "port":27017,
        "username":"",
        "password":"",
        "name":"",
        "db":"db"
    };
    var mongolab1url={
        "hostname":"ds031617.mongolab.com",
        "port":31617,
        "username":"mongolab1",
        "password":"mongolab1",
        "name":"mongolab1",
        "db":"mongolab1"
            
    }
}
var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}

exports.mongourl = generate_mongo_url(mongo);
exports.mongolab1url = generate_mongo_url(mongolab1url);