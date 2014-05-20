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
      callback(null,headers,body);
    });
    res.on('error',function(err){
      callback(err);
    })
  });
  if(data!==undefined){
    request.write(data);
  }
  request.on('error',function(err){
    callback(err);
  })
  request.end();
}