var http=require('http');
var url=require('url');

/**/
module.exports=function(method,options,data,callback){
	if(arguments.length==2){
		callback=options; //如果只传入2个参数，则传的是options 和 callback
		options=method;
	}
	if(arguments.length==3){
		if(typeof arguments[0]=='string'){
			options.method=method;
			callback=data;
		}else{
			callback=data;
			data=options;
			options=method;
		}
	}
	if(arguments.length==4){
		options.method=method;
	}
	var request=http.request(options,function(res){

		var body='';
//		res.setEncoding('utf8');
		res.on('data',function(data){
//			console.log(data);
			body+=data;
		});
		res.on('end',function(){
			callback(body);
		});
	});
	if(data!==undefined){
		request.write(data);
	}
	request.end();
}