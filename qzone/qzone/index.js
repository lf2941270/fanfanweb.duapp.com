var conf=require('../conf');
var user=conf.user;
var EventProxy = require('eventproxy');
var Browser=require('../browser');
var myUtil=require('../util');
var jsdom=require('jsdom');
var querystring=require('querystring');
var encryption=require('./encryption');
var getLoginUrl=require('./getloginurl');

var interval=conf.config.interval;
var lastReplyTime='0';//最近评论的一条说说的发布时间


var browser=new Browser();
browser.init();
function firstLogin(){
  var proxy=new EventProxy();
  proxy.on('iFrameSrc',function(src,verifycode){
    //取得了登录的iframe的src，登录表单要POST到这个地址
    browser.get(src,function(headers,body){
      jsdom.env(
          body,
          ["http://code.jquery.com/jquery.js"],
          function (errors, window) {
            var verifycode=window.$("#verifycode").val();
            eval(window.$(window.$('script')[0]).text());
            proxy.emit('iframeLoaded',src,verifycode,pt.ptui);
          }
      );
    });
  });
  proxy.on('iframeLoaded',function(src,verifycode,ptui){
    browser.setCookie('ptui_loginuin='+querystring.escape(user.u));
    var loginUrl=getLoginUrl.getLoginUrl(verifycode,ptui);
    var checkUrl=getLoginUrl.getCheckUrl();
    browser.get(checkUrl,function(headers,body){
      function ptui_checkVC(A,B,C){
        var loginUrl=getLoginUrl.getLoginUrl(B,ptui);
        proxy.emit('ready',loginUrl)
      }
      eval(body)
    })

  })
  proxy.on('ready',function(loginUrl){
//    console.log(browser.headers.cookie)
    browser.get(loginUrl,function(headers,body){
     console.log(browser.headers);
     console.log('===============================body===================================');
     console.log(body);
     })
  })
  proxy.on('body',function(body){
    jsdom.env(
        body,
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
          var src=window.$("#login_frame").attr("src");
          proxy.emit('iFrameSrc',src);
        }
    );
  })
  browser.get('http://qzone.qq.com',function(headers,body){

    proxy.emit('body',body);
  })
}
firstLogin()

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

 /* request(options,function(response){
		console.log(new Date())
    eval(response);//会调用上面定义的 _Callback 函数
  });*/
}
function init(){
  timer();
  setTimeout(function(){
    init();
  },interval);
}

exports.init=init;