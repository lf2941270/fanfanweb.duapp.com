


var qzone=require('./qzone');

/*app.set('port', process.env.PORT || 18080);

app.use(app.router); //改为(app.router)
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}*/
//qzone.init();
var http=require('http');
var url=require('url');
var href='http://check.ptlogin2.qq.com/check?regmaster=&uin=454730788&appid=549000912&js_ver=10079&js_type=1&login_sig=PD7xbyzgBmZxCHHe-9kaVTTs1hLkKXZ2cntsPe4EkP7q9mGntlA1QVsbQ8YUnrXQ&u1=http%3A%2F%2Fqzs.qq.com%2Fqzone%2Fv5%2Floginsucc.html%3Fpara%3Dizone&r=0.8059756337819094';
var options=url.parse(href);
options.method='get';
console.log(options);
var request=http.request(options,function(res){
	var headers=res.headers;
	var body='';
	//res.setEncoding('utf8');
	res.on('data',function(data){
		//console.log(data);
		body+=data;
	});
	res.on('end',function(){
		console.log(body);
	});
	res.on('error',function(err){

	})
})
request.end();
/*

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port')+' in '+process.env.NODE_ENV+' mode');
});
routes(app);//额外加上
*/
