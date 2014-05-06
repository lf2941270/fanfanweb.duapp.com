var util=require('util');
var request=require('../request');
var mainPath='http://www.ibaiyu.cn';
var querystring=require('querystring');

module.exports=function(app){
	app.get('*',function(req,res){
		var query=req.query;
    var path=req.path;
    console.log(req);
    request((mainPath+path+'?'+querystring.stringify(query)),function(response){
      res.send(response);
    });
	});
}