var settings = require('../settings');
var mongodb = require('./db');
module.exports=function(callback){
    mongodb.open(function(err, mongodb) {
        mongodb.authenticate(settings.user, settings.password, function(err, result) {
            if (err) {
                mongodb.close();
                callback(err)
                return;
            }
            callback(null,mongodb);
        });
    });
}