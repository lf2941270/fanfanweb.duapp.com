var EventProxy = require('eventproxy');
var jsdom=require('jsdom');
var querystring=require('querystring');
var encryption=require('./encryption');
var getLoginUrl=require('./getloginurl');
var conf=require('../conf');
var user=conf.user;
var browser=require('./browser');

function login(cb){
  var proxy=new EventProxy();
  browser.get('http://qzone.qq.com',function(headers,body){
    proxy.emitLater('body',body);
  });
  proxy.on('body',function(body){
    jsdom.env(
        body,
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
          var src=window.$("#login_frame").attr("src");
          proxy.emitLater('iFrameSrc',src);
        }
    );
  })
  proxy.on('iFrameSrc',function(src,verifycode){
    //取得了登录的iframe的src，登录表单要POST到这个地址
    /*browser.setHeader({
     Referer:src
     });*/
    browser.get(src,function(headers,body){
      jsdom.env(
          body,
          ["http://code.jquery.com/jquery.js"],
          function (errors, window) {
            var verifycode=window.$("#verifycode").val();
            eval(window.$(window.$('script')[0]).text());
            proxy.emitLater('iframeLoaded',src,verifycode,pt.ptui);
          }
      );
    });
  });
  proxy.on('iframeLoaded',function(src,verifycode,ptui){
    browser.setCookie('ptui_loginuin='+querystring.escape(user.u));
    /*browser.get('http://ptlogin2.qq.com/ptqrshow?appid='+ptui.appid+'&e=2&l=M&s=3&d=72&v=4&t=0.8360795713961124',function(){

     });*/
    var checkUrl=getLoginUrl.getCheckUrl(user.u,ptui);
    setCookieWork();
    browser.get(checkUrl,function(headers,body){
      /*返回JSONP的处理函数*/
      function ptui_checkVC(A,B,C){
        var loginUrl=getLoginUrl.getLoginUrl(B,ptui,C);
        proxy.emitLater('ready',loginUrl);
      }
      eval(body);
    });
  });
  proxy.on('ready',function(loginUrl){
    browser.get(loginUrl,function(headers,body){
      cb();
    });
  })
  function setCookieWork(){
    var d = (Math.round(Math.random() * 2147483647) * (new Date().getUTCMilliseconds())) % 10000000000;
    browser.setCookie("pgv_pvid=" + d);
    var f = (Math.round(Math.random() * 2147483647) * (new Date().getUTCMilliseconds())) % 10000000000;
    browser.setCookie("pgv_info=ssid=s" + f);
//		browser.setCookie('qrsig=dfTEsX6Pxz5KSr4-u8AsRnmgfPcah-nYKL051Hkl6M-ZDEQ4WIP3M8C9E3QftGlC');
  }
}

module.exports=login;