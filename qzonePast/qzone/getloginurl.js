var user=require('../conf').user;
var encryption=require('./encryption');

var D={};
/*function getCheckUrl(){
  var checkUrl='http://check.ptlogin2.qq.com/check?';
  checkUrl+=('uin='+user.u+"&");
  checkUrl+=('appid='+D['aid']+"&");
  checkUrl+=('js_ver='+D['js_ver']+"&");
  checkUrl+=('js_type='+D['js_type']+"&");
  checkUrl+=('login_sig='+D['login_sig']+"&");
  checkUrl+=('u1='+D['u1']+"&");
  checkUrl+=('r='+Math.random()+"&");
  return checkUrl;
}*/
function getCheckUrl(b,ptui) {
  var pt={};
  pt.plogin={};
  pt.ptui=ptui;
  pt.plogin.checkUrl = (pt.ptui.isHttps ? "https://ssl." : "http://check.") + "ptlogin2." + pt.ptui.domain + "/check";
  var a = pt.plogin.checkUrl + "?regmaster=" + pt.ptui.regmaster + "&";
  a += "uin=" + b + "&appid=" + pt.ptui.appid + "&js_ver=" + pt.ptui.ptui_version + "&js_type=" + "1" + "&login_sig=" + pt.ptui.login_sig + "&u1=" + encodeURIComponent(pt.ptui.s_url) + "&r=" + Math.random();
  return a;
}
function getloginUrl(verifycode,ptui,saltUin){
  var A='http://ptlogin2.qq.com/login?';
  D.u = encodeURIComponent(user.u);
  D.verifycode=verifycode;
  D.p = encryption.getEncryption(user.p, saltUin, D.verifycode);
  D.pt_rsa = 0;
  D.u1 = encodeURIComponent('http://qzs.qq.com/qzone/v5/loginsucc.html?para=izone');
  D.ptredirect=0;
  D.h = 1;
  D.t = 1;
  D.g = 1;
  D.from_ui = 1;
  D.ptlang = ptui.lang;
  D.action = [3,5].join("-") + "-" + (new Date() - 0);
  D.js_ver = ptui.ptui_version;
  D.js_type = 1;
  D.login_sig = ptui.login_sig;
  D.pt_uistyle = ptui.style;
  if (false) {
    D.low_login_enable = 1;
    D.low_login_hour = pt.plogin.low_login_hour
  }
  if (ptui.csimc != "0") {
    D.csimc = pt.ptui.csimc;
    D.csnum = pt.ptui.csimc;
    D.authid = pt.ptui.csimc
  }
  D.aid = ptui.appid;
  if (ptui.daid) {
    D.daid = ptui.daid
  }
  if (ptui.pt_3rd_aid != "0") {
    D.pt_3rd_aid = ptui.pt_3rd_aid
  }
  if (ptui.regmaster) {
    D.regmaster = ptui.regmaster
  }
  if (ptui.mibao_css) {
    D.mibao_css = ptui.mibao_css
  }
  if (ptui.pt_qzone_sig == "1") {
    D.pt_qzone_sig = 1
  }
  if (ptui.pt_light == "1") {
    D.pt_light = 1
  }
  for (var C in D) {
    A += (C + "=" + D[C] + "&")
  };
  return A;
}
exports.getLoginUrl=getloginUrl;
exports.getCheckUrl=getCheckUrl;