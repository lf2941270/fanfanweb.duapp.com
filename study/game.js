/*作为代理将服务器的响应包装为JSONP的响应*/

var express=require('express');

var app=express();
var routes = require('./routes');

app.set('port', process.env.PORT || 18080);
app.use(app.router); //改为(app.router)
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port')+' in '+process.env.NODE_ENV+' mode');
});
routes(app);//额外加上