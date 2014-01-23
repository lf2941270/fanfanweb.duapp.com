var settings = require('../settings');
var mongodb = require('./db');
module.exports=function(callback2){
    mongodb.open(function(err, db) {
        db.authenticate(settings.user, settings.password, function(err, result) {
            if (err) {
                db.close();
                callback2(err)
                return;
            }
            callack2(null,db);
        });
    });
}