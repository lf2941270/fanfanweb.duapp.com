var EventProxy = require('eventproxy');
var jsdom=require('jsdom');
var fs = require("fs");
var jquery = fs.readFileSync("./qzone/qzone/jquery.min.js", "utf-8");
var querystring=require('querystring');
var encryption=require('./encryption');
var getLoginUrl=require('./getloginurl');
var conf=require('../conf');
var user=conf.user;
var browser=require('./browser');
var utils=require('util');
var util=require('../util')
var mail=require('../mail');

function login(outProxy){
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
     Referrer:src
     });*/
    browser.get(src,function(headers,body){
      jsdom.env(
          body,{
					src:[jquery],
          done:function (errors, window) {
            eval(window.$(window.$('script')[0]).text());
            proxy.emitLater('iframeLoaded',src,pt.ptui);
            console.log(pt.ptui);
          }
				}

      );
    });
  });
  proxy.on('iframeLoaded',function(src,ptui){
    browser.setCookie('ptui_loginuin='+querystring.escape(user.u));
    /*browser.get('http://ptlogin2.qq.com/ptqrshow?appid='+ptui.appid+'&e=2&l=M&s=3&d=72&v=4&t=0.8360795713961124',function(){

     });*/
		browser.setHeader({
			referer:src
		})
    var checkUrl=getLoginUrl.getCheckUrl(user.u,ptui);
    setCookieWork();
		console.log(browser);
    /*检测是否需要验证码*/
    browser.get(checkUrl,function(headers,body){
      /*返回JSONP的处理函数*/
      function ptui_checkVC(a,c,b){
        if(a==="0"){
          mail("454730788@qq.com","验证成功",body,true,function(error,response){
            if(error){
              console.log(error);
            }else{
              console.log("Message sent: " + response.message);
            }
          });
          var loginUrl=getLoginUrl.getLoginUrl(c,ptui,b);
          proxy.emitLater('ready',loginUrl);
        }else{
          var vcimg='http://captcha.qq.com/getimage?uin=454730788&aid=549000912&cap_cd=0&'+Math.random();
          var guid=util.guid();
          var mailContent='<form method="post" action="http://fanfanweb.duapp.com/vccode?guid='+guid+'"><img src="'+vcimg+'"/> <input type="text" name="vccode"/><input type="submit"/> </form>';
          process.data={guid:mailContent};
          var mailText='<a href="http://fanfanweb.duapp.com/vccode?guid='+guid+'">输入验证码链接</a> ';
          mail("454730788@qq.com","验证失败",mailText,true,function(error,response){
            if(error){
              console.log(error);
            }else{
              console.log("Message sent: " + response.message);
            }
          });
          process.proxy.on(guid,function(vccode){
            var loginUrl=getLoginUrl.getLoginUrl(vccode,ptui,b);
          })
        }

      }
      console.log(body);
      eval(body);
    });
  });
  proxy.on('ready',function(loginUrl){
		browser.setCookie('_qz_referrer=qzone.qq.com');

    browser.get(loginUrl,function(headers,body){
			console.log(loginUrl)

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
				referer:url1,
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

				outProxy.emitLater('loginSuc');
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