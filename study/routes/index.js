var util=require('util');
var httpGet=require('../httpGet');
var mainPath='http://www.ibaiyu.cn/admin/Servers/SdPay.ashx';
var querystring=require('querystring');

module.exports=function(app){
	app.get('/server',function(req,res){
		var query=req.query;
		switch (query.method) {
			case 'GetServers':
				if(query.GameId){
					httpGet((mainPath+'?'+querystring.stringify(query)),function(response){

						res.send(response);
					})
				}
				break;
		}
	})
}