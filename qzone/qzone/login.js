var EventProxy = require('eventproxy');
var jsdom=require('jsdom');
var fs = require("fs");
var jquery = fs.readFileSync("./qzone/jquery.min.js", "utf-8");
var querystring=require('querystring');
var encryption=require('./encryption');
var getLoginUrl=require('./getloginurl');
var conf=require('../conf');
var user=conf.user;
var browser=require('./browser');
var utils=require('util');

function login(cb){
  var proxy=new EventProxy();
  browser.get('http://qzone.qq.com',function(headers,body){
    proxy.emitLater('body',body);
  });
  proxy.on('body',function(body){
    jsdom.env(
        body,{
				src:[jquery],
			done:function (errors, window) {
				var src=window.$("#login_frame").attr("src");
				proxy.emitLater('iFrameSrc',src);
			}
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
          body,{
					src:[jquery],
				done:function (errors, window) {
					var verifycode=window.$("#verifycode").val();
					eval(window.$(window.$('script')[0]).text());
					proxy.emitLater('iframeLoaded',src,verifycode,pt.ptui);
				}
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
		browser.setCookie('_qz_referrer=qzone.qq.com');
    browser.get(loginUrl,function(headers,body){
			function ptuiCB(a,b,c,d,e,f){
				var ptsig= c.substring(c.indexOf('ptsig='));
				proxy.emitLater('ptsig',ptsig);
			}
			eval(body);
    });
  });
	proxy.on('ptsig',function(ptsig){
		var url1='http://qzs.qq.com/qzone/v5/loginsucc.html?para=izone&'+ptsig;
		browser.get(url1,function(headers,body){
//			console.log(body)
			browser.setHeader({
				'Proxy-Connection': 'keep-alive',
				referer:'',
				'Avail-Dictionary':'',
				Accept: '',
				'Accept-Encoding': '',
				'Accept-Language': '',
				'Accept-Charset': ''
			});
      browser.setCookie('ptsig='+ptsig);
			var url='http://user.qzone.qq.com/'+user.u+'?'+ptsig;
//			browser.setCookie('fnc=2');

			browser.get(url,function(headers,body){
				cb();
			});
		});
	});
  function setCookieWork(){
    var d = (Math.round(Math.random() * 2147483647) * (new Date().getUTCMilliseconds())) % 10000000000;
    browser.setCookie("pgv_pvid=" + d);
    var f = (Math.round(Math.random() * 2147483647) * (new Date().getUTCMilliseconds())) % 10000000000;
    browser.setCookie("pgv_info=ssid=s" + f);
//		browser.setCookie('qrsig=dfTEsX6Pxz5KSr4-u8AsRnmgfPcah-nYKL051Hkl6M-ZDEQ4WIP3M8C9E3QftGlC');
  }
}

module.exports=login;