var conf=require('../conf');
var request=require('../request');
var url=require('url');
var myUtil=require('../util');

var interval=conf.config.interval;
var options=parseOptions(conf.options);
var lastReplyTime='0';//最近评论的一条说说的发布时间
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

function _Callback(res){
  if (res.data!==undefined){
    var data=res.data.data;
    myUtil.eachArray(data,function(index,value){//返回 true 时可以结束对数组的遍历
      if(value!==undefined){
        if(value.abstime<=lastReplyTime){
          return true;
        }
        console.log('第%d条说说的key：%s',index,value.key);
//			dealWith(value);

      }
    });
  }else{
    console.log(res);
  }
}
function timer(){
  request(options,function(response){
		console.log(new Date())
    eval(response);//会调用上面定义的 _Callback 函数
  });
}
function init(){
  timer();
  setTimeout(function(){
    init();
  },interval);
}

exports.init=init;