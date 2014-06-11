var browser=require('./browser');
var conf=require('../conf');
var user=conf.user;
var querystring=require('querystring');
var EventProxy=require('eventproxy');
var jsdom=require('jsdom');
var fs = require("fs");
var jquery = fs.readFileSync("./qzone/qzone/jquery.min.js", "utf-8");

var url='http://user.qzone.com/';
function Shuo(me){
  for(var i in me){
    this[i]=me[i];
  }
}
//获取ptsig
function getPtsig(){
  return browser.cookie.ptsig.split('=')[1];
}
function getQzreferrer(){
  return url+user.u+'/infocenter?ptsig='+getPtsig();
}
function getUnikey(opuin,key){
  return url+opuin+'/mood/'+key;
}
function getG_tk(){
  return browser.cookie.g_tk;
}
function getdatastat(html,callback){
  var proxy=new EventProxy();
  jsdom.env(
      html,{
        src:[jquery],
        done:function (errors, window) {
          var datastat=window.$("i[data-stat]").attr("data-stat");
          proxy.emitLater('datastat',datastat);
        }
      }
  );
  proxy.on('datastat',function(datastat){
    callback(datastat);
  })
}
Shuo.prototype.showOpuin=function(){
}
/*点赞的外部接口*/
Shuo.prototype.like=function(){
  var _=this;
  var proxy=new EventProxy();

  getdatastat(_.html,function(datastat){
    proxy.emitLater('datastat',datastat);
  });

  proxy.on('suc',function(confirmurl){
    var url='http://pinghot.qq.com/pingd?dm=internallike.qzone.qq.com.hot&url=/feeds&tt=-&hottag=0_appid_'+ _.appid+'_v8.typeid_'+ _.typeid+'.operate.zan&hotx=9999&hoty=9999&rand='+Math.random();
    browser.get(url,function(){
      browser.get(confirmurl,function(){

      })
    });
  });
  proxy.on('datastat',function(datastat){
    var confirmurl=createLikeConfirm(datastat);
    browser.get(confirmurl,function(headers,body){
      browser.setHeader({
        referrer: getQzreferrer()
      });
      var form=_.createLikeForm();
      var posturl='http://w.qzone.qq.com/cgi-bin/likes/internal_dolike_app?g_tk='+getG_tk();
      browser.postForm(posturl,form,function(headers,body){
        proxy.emitLater('suc',confirmurl);
      });
    })
  })
}
function createLikeConfirm(datastat){
  return 'http://statistic.qzone.qq.com/cgi-bin/feeds2_oz?uin='+user.u+'&domain=1&statdata='+datastat+'&updateoz=0&pcver=PCV8';
}
/*生成赞的表单*/
Shuo.prototype.createLikeForm=function(){
  var form= {
    qzreferrer:getQzreferrer(),
    opuin:user.u,
    unikey:getUnikey(this.opuin,this.key),
    curkey:getUnikey(this.opuin,this.key),
    from:1,
    appid:311,
    typeid:0,
    abstime:this.abstime,
    fid:this.key,
    active:0,
    fupdate:1
  }
  console.log('(♥◠‿◠)ﾉ (♥◠‿◠)ﾉ (♥◠‿◠)ﾉ (♥◠‿◠)ﾉ (♥◠‿◠)ﾉ开心的昏割线 (♥◠‿◠)ﾉ (♥◠‿◠)ﾉ (♥◠‿◠)ﾉ (♥◠‿◠)ﾉ (♥◠‿◠)ﾉ (♥◠‿◠)ﾉ');
  console.log(form);
  return querystring.stringify(form);
}
module.exports=Shuo;