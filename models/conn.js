var settings = require('../settings');
var mongodb = require('./db');
module.exports=function(callback2){
    mongodb.open(function(err, mongodb) {
        mongodb.authenticate(settings.user, settings.password, function(err, result) {
            if (err) {
                mongodb.close();
                callback2(err)
                return;
            }
            callack2(null,mongodb);
        });
    });
}