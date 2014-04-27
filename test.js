var http=require('http');
var url=require('url');

var server=new http.Server();
var num1= 0,num2=0;
server.on('request',function(req,res){
//	console.log('收到客户端请求数 : '+(++num1));
	var time1=new Date(),time2;
	var linkUrl=req.url;
	var options=url.parse(linkUrl);
	options.headers=req.headers;
	var request=http.request(options,function(response){
		time2=new Date();
		console.log(++num2 + ':获取 '+linkUrl+ ' 的响应，'+'用时' +(time2-time1) +'ms\n');

		res.writeHead(response.statusCode,response.headers);
		response.on('data',function(data){
			res.write(data);
		});
		response.on('end',function(){
			res.end()
		});
	});
	req.on('data',function(data){
		request.write(data);
	});
	req.on('end',function(){
		request.end();
	});
	request.end();
});
server.listen(8080);
