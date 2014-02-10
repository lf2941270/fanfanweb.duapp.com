var settings = require('../settings');
var mongodb = require('./db');
module.exports=function(callback){
    mongodb.open(function(err, mongodb) {
        if(process.env.BAE_ENV_APPID=='appid4wxmfatc0t'){//如果在bae环境,则需要通过账号密码验证后连接mongodb
            mongodb.authenticate(settings.user, settings.password, function(err, result) {
                if (err) {
                    mongodb.close();
                    callback(err)
                    return;
                }
                callback(null,mongodb);
            });
        }else{
            callback(null,mongodb);
        }
    });
}