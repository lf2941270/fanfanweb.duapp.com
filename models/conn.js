var settings = require('../settings');
var mongodb = require('./db');
module.exports=function(callback){
    mongodb.open(function(err, db) {
        db.authenticate(settings.user, settings.password, function(err, result) {
            if (err) {
                db.close();
                callback(err)
                return;
            }
            callack(null,db);
        });
    });
}