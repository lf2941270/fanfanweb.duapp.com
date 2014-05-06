var conf=require('../conf');
var httpGet=require('../httpGet');
var url=require('url');

var interval=conf.config.interval;
var options=parseOptions(conf.options);
function parseOptions(op){
  var uri=op.uri;
  var options=url.parse(uri);
  options.headers={};
  for(var i in op){
    if(i!=='uri'){
      options.headers[camelCaseParse(i)]=op[i];
    }
  }
  return options;
}
//将驼峰法命名转换为‘-’形式的命名
function camelCaseParse(name){
  var arr=name.split('');
  var regexp=/[A-Z]/g;
  for(var i= 1,len=arr.length;i<len;i++){
    if(regexp.test(arr[i])){
      arr[i]='-'+arr[i].toLowerCase();
    }
  }
  return arr.join('');
}
function timer(){
  httpGet(options,function(response){
    console.log(response);
  });
}
function init(){
  timer();
  setTimeout(function(){
    init();
  },interval);
}

exports.init=init;