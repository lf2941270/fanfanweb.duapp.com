var conf=require('../conf');
var EventProxy = require('eventproxy');
var browser=require('./browser');
var myUtil=require('../util');
var login=require('./login');

var interval=conf.config.interval;
var lastReplyTime='0';//最近评论的一条说说的发布时间


var proxy=new EventProxy();
var timeout;


function _Callback(res){
  console.log('==================================================')
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
function getg_tk(browser) {
	var str=browser.cookie.p_skey;
	if(!str){
		str=browser.cookie.skey;
	}
	var hash = 5381;
	for (var i = 0, len = str.length; i < len; ++i)
		hash += (hash << 5) + str.charCodeAt(i);
	return hash & 2147483647
};
//周期性调用的函数，调用完成后执行传入的回调函数进行下一次调用
function timer(callback){
	var refUrl=conf.refreshUrl+"rd="+Math.random()+"&g_tk="+getg_tk(browser);
	browser.get(refUrl,function(headers,body){
    eval(body)
    callback();
  });
 /* request(options,function(response){
		console.log(new Date())
    ;//会调用上面定义的 _Callback 函数
  });*/
}
function init(){
  login(function(){
    proxy.emitLater('loginSuc');
  });
  proxy.on('loginSuc',function(){
    refresh();
  });
}
function refresh(){
  timer(function(){
    timeout=setTimeout(function(){
      refresh();
    },interval);
  });
}
exports.init=init;