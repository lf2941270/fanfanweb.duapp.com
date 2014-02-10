var settings = require('../settings');
var mongodb = require('./db');
module.exports=function(callback){
    mongodb.open(function(err, mongodb) {
        if(process.env.SERVER_SORTWARE){//如果在bae环境
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