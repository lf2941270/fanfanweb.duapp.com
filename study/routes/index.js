var util=require('util');
var httpGet=require('../httpGet');
var mainPath='http://www.ibaiyu.cn';
var querystring=require('querystring');

module.exports=function(app){
	app.get('*',function(req,res){
		var query=req.query;
    var path=req.path;
    httpGet((mainPath+path+'?'+querystring.stringify(query)),function(response){
      res.send(response);
    });
	});
}