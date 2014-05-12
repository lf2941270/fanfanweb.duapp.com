var http=require('http');


/*data 为可选项*/
module.exports=function(options,data,callback){
  if(arguments.length===2){
    callback=data;
    data=undefined;
  }
  var request=http.request(options,function(res){
    var headers=res.headers;
    var body='';
    //res.setEncoding('utf8');
    res.on('data',function(data){
      //console.log(data);
      body+=data;
    });
    res.on('end',function(){
      callback(headers,body);
    });
  });
  if(data!==undefined){
    request.write(data);
  }
  request.end();
}