var http=require('http');
var url=require('url');

module.exports=function(uri,cb,cookie){
	var options=url.parse(uri);
//	console.log(options);
	options.method='get';
  if(cookie!==undefined){
    console.log('request with cookie')
    options.cookie=cookie;
  }
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