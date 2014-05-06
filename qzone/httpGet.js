var http=require('http');
var url=require('url');

module.exports=function(options,cb){

	var request=http.request(options,function(res){

		var body='';
		res.setEncoding('utf8');
		res.on('data',function(data){
//			console.log(data);
			body+=data;
		});
		res.on('end',function(){
			cb(body);
		});
	});
	request.end();
}