var conf=require('../conf');
var EventProxy = require('eventproxy');
var browser=require('./browser');
var myUtil=require('../util');
var login=require('./login');
var shuoshuo=require('./shuoshuo');

var interval=conf.config.interval;

var proxy=new EventProxy();
var timeout;
var n=0;

function getg_tk(browser) {
	var str=browser.cookie.p_skey;
	if(!str){
		str=browser.cookie.skey||browser.cookie.rv2;
	}
	var hash = 5381;
	for (var i = 0, len = str.length; i < len; ++i)
		hash += (hash << 5) + str.charCodeAt(i);
	return hash & 2147483647
};
//周期性调用的函数，调用完成后执行传入的回调函数进行下一次调用
function timer(callback){
	function _Callback(res){
		console.log('========================第%d次刷新，时间：%s==========================',++n,new Date());
		if (res.data!==undefined){
			callback();
			var data=res.data.data;
			myUtil.eachArray(data,function(index,value){//返回 true 时可以结束对数组的遍历
				var lastFlag=false,
          firstFlag=false;
        if(index===0){
          firstFlag=true;
        }
				if(index===data.length-2){
					lastFlag=true;
				}
				if(value!==undefined){
					return shuoshuo(value,firstFlag,lastFlag);
				}
			});
		}else{
			clearTimeout(timeout);
			init();
		}
	}
	var refUrl=conf.refreshUrl+"rd="+Math.random()+"&g_tk="+getg_tk(browser);
  browser.setCookie('g_tk='+getg_tk(browser));//设置g_tk到cookie中，供点赞和评论时使用
	browser.get(refUrl,function(headers,body){
    eval(body);
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