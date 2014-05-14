var pt= function() {
  var h = {"19": 3,"20": 2,"21": 3,"22": 3,"23": 3,"25": 3,"32": 3,"33": 3,"34": 3};
  var P = {"19": 300,"20": 240,"21": 360,"22": 360,"23": 300,"25": 300,"32": 360,"33": 300,"34": 300};
  var Y = [];
  var N = [];
  var Z = 9;
  var o = '<a hidefocus=true draggable=false href="javascript:void(0);" tabindex="#tabindex#" uin="#uin#" type="#type#" onclick="pt.qlogin.imgClick(this);return false;" onfocus="pt.qlogin.imgFocus(this);" onblur="pt.qlogin.imgBlur(this);" onmouseover="pt.qlogin.imgMouseover(this);" onmousedown="pt.qlogin.imgMouseDowm(this)" onmouseup="pt.qlogin.imgMouseUp(this)" onmouseout="pt.qlogin.imgMouseUp(this)" class="face"  >          <img  id="img_#uin#" uin="#uin#" type="#type#" src="#src#"    onerror="pt.qlogin.imgErr(this);" />           <span id="mengban_#uin#"></span>          <span class="uin_menban"></span>          <span class="uin">#uin#</span>          <span id="img_out_#uin#" uin="#uin#" type="#type#"  class="img_out"  ></span>          <span id="nick_#uin#" class="#nick_class#">#nick#</span>          <span  class="#vip_logo#"></span>      </a>';
  var R = '<span  uin="#uin#" type="#type#"  class="#qr_class#"  >          <span class="qr_safe_tips">安全登录，防止盗号</span>          <img   id="qrlogin_img" uin="#uin#" type="#type#" src="#src#" class="qrImg"  />           <span id="nick_#uin#"  class="qr_app_name">            <a class="qr_short_tips"  href="http://im.qq.com/mobileqq/#from=login" target="_blank">#nick#</a>            <span class="qr_safe_login">安全登录</span>            <a hidefocus=true draggable=false class="qr_info_link"  href="http://im.qq.com/mobileqq/#from=login" target="_blank">使用QQ手机版扫描二维码</a>          </span>          <span  class="qrlogin_img_out"  onmouseover="pt.plogin.showQrTips();" onmouseout="pt.plogin.hideQrTips();"></span>          <span id="qr_invalid" class="qr_invalid" onclick="pt.plogin.begin_qrlogin();" onmouseover="pt.plogin.showQrTips();" onmouseout="pt.plogin.hideQrTips();">            <span id="qr_mengban" class="qr_mengban"></span>            <span id="qr_invalid_tips" class="qr_invalid_tips">二维码失效<br/>请点击刷新</span>          </span>       </span>';
  var d = false;
  var J = 1;
/*  var W = h[pt.ptui.style];
  var T = P[pt.ptui.style];*/
  var Q = 1;
  var j = 5;
  var E = null;
  var g = true;
  var l = 0;
  var A = function(w) {
    if ((w == 1 && Q <= 1) || (w == 2 && Q >= J)) {
      return
    }
    var s = 0;
    var v = 1;
    var u = $("qlogin_show").offsetWidth || T;
    var p = 10;
    var t = Math.ceil(u / p);
    var r = 0;
    if (w == 1) {
      Q--;
      if (Q <= 1) {
        $.css.hide($("prePage"));
        $.css.show($("nextPage"))
      } else {
        $.css.show($("nextPage"));
        $.css.show($("prePage"))
      }
    } else {
      Q++;
      if (Q >= J) {
        $.css.hide($("nextPage"));
        $.css.show($("prePage"))
      } else {
        $.css.show($("nextPage"));
        $.css.show($("prePage"))
      }
    }
    function q() {
      if (w == 1) {
        $("qlogin_list").style.left = (r * p - Q * u) + "px"
      } else {
        $("qlogin_list").style.left = ((2 - Q) * u - r * p) + "px"
      }
      r++;
      if (r > t) {
        window.clearInterval(s)
      }
    }
    s = window.setInterval(q, v)
  };
  var k = function() {
    N.length = 0;
    if ($.suportActive()) {
      try {
        var AT = $.activetxsso;
        var w = AT.CreateTXSSOData();
        var AQ = AT.DoOperation(1, w);
        if (null == AQ) {
          return
        }
        var AL = AQ.GetArray("PTALIST");
        var AV = AL.GetSize();
        var AP = "";
        for (var AW = 0; AW < AV; AW++) {
          var u = AL.GetData(AW);
          var AS = u.GetDWord("dwSSO_Account_dwAccountUin");
          var AF = u.GetDWord("dwSSO_Account_dwAccountUin");
          var z = "";
          var AE = u.GetByte("cSSO_Account_cAccountType");
          var AU = AS;
          if (AE == 1) {
            try {
              z = u.GetArray("SSO_Account_AccountValueList");
              AU = z.GetStr(0)
            } catch (AR) {
            }
          }
          var AI = 0;
          try {
            AI = u.GetWord("wSSO_Account_wFaceIndex")
          } catch (AR) {
            AI = 0
          }
          var AK = "";
          try {
            AK = u.GetStr("strSSO_Account_strNickName")
          } catch (AR) {
            AK = ""
          }
          var v = u.GetBuf("bufGTKey_PTLOGIN");
          var x = u.GetBuf("bufST_PTLOGIN");
          var AD = "";
          var p = x.GetSize();
          for (var AO = 0; AO < p; AO++) {
            var q = x.GetAt(AO).toString("16");
            if (q.length == 1) {
              q = "0" + q
            }
            AD += q
          }
          var AH = u.GetDWord("dwSSO_Account_dwUinFlag");
          var AC = {uin: AS,name: AU,uinString: AF,type: AE,face: AI,nick: AK,flag: AH,key: AD,loginType: 2};
          N.push(AC)
        }
      } catch (AR) {
        $.report.nlog("IE获取快速登录信息失败：" + AR.message, "391626")
      }
    } else {
      try {
        var r = $.nptxsso;
        var AB = r.InitPVA();
        if (AB != false) {
          var y = r.GetPVACount();
          for (var AO = 0; AO < y; AO++) {
            var s = r.GetUin(AO);
            var t = r.GetAccountName(AO);
            var AF = r.GetUinString(AO);
            var AA = r.GetFaceIndex(AO);
            var AM = r.GetNickname(AO);
            var AG = r.GetGender(AO);
            var AN = r.GetUinFlag(AO);
            var AX = r.GetGTKey(AO);
            var AJ = r.GetST(AO);
            var AC = {uin: s,name: t,uinString: AF,type: 0,face: AA,nick: AM,flag: AN,key: AJ,loginType: 2};
            N.push(AC)
          }
          if (typeof (r.GetKeyIndex) == "function") {
            Z = r.GetKeyIndex()
          }
        }
      } catch (AR) {
        $.report.nlog("非IE获取快速登录信息失败：" + (AR.message || AR), "391627")
      }
    }
  };
  var K = function(r) {
    for (var q = 0, p = N.length; q < p; q++) {
      var s = N[q];
      if (s.uinString == r) {
        return s
      }
    }
    return null
  };
  var a = function() {
    k();
    var u = [];
    var s = N.length;
    if (pt.plogin.isNewQr) {
      var t = {};
      t.loginType = 3;
      u.push(t)
    }
    if (pt.plogin.authUin && pt.ptui.auth_mode == "0") {
      var t = {};
      t.name = pt.plogin.authUin;
      t.uinString = pt.plogin.authUin;
      t.nick = $.str.utf8ToUincode($.cookie.get("ptuserinfo")) || pt.plogin.authUin;
      t.loginType = 1;
      u.push(t)
    }
    for (var p = 0; p < s; p++) {
      var r = N[p];
      if (pt.plogin.authUin && (pt.plogin.authUin == r.name || pt.plogin.authUin == r.uinString)) {
        continue
      } else {
        u.push(r)
      }
      if (u.length == 5) {
        break
      }
    }
    Y = u;
    return u
  };
  var m = function() {
    var z = "";
    var AB = 0;
    var y = a();
    var AC = $("qlogin_list");
    if (null == AC) {
      return
    }
    var v = y.length > j ? j : y.length;
    if (v == 0) {
      pt.plogin.switchpage(1, true);
      return
    }
    if (pt.plogin.isNewQr) {
      if (v == 1 && pt.plogin.isNewQr) {
        $("qlogin_tips") && $.css.hide($("qlogin_tips"));
        $("qlogin_show").style.top = "25px"
      } else {
        $("qlogin_tips") && $.css.show($("qlogin_tips"));
        $("qlogin_show").style.top = ""
      }
    }
    J = Math.ceil(v / W);
    if (J >= 2) {
      $.css.show($("nextPage"))
    }
    for (var t = 0; t < v; t++) {
      var u = y[t];
      var r = $.str.encodeHtml(u.uinString + "");
      var q = $.str.encodeHtml(u.nick);
      if ($.str.trim(u.nick) == "") {
        q = r
      }
      var AA = u.flag;
      var x = ((AA & 4) == 4);
      var p = pt.plogin.dftImg;
      if (u.loginType == 3) {
        var s = $("qr_area");
        if (v == 1) {
          if (s) {
            $("qr_area").className = "qr_0"
          }
          if (pt.ptui.lang == "1033") {
            $("qlogin_show").style.height = ($("qlogin_show").offsetHeight + 10) + "px"
          }
        } else {
          if (s) {
            $("qr_area").className = "qr_1"
          }
        }
      } else {
        z += o.replace(/#uin#/g, r).replace(/#nick#/g, function() {
          return q
        }).replace(/#nick_class#/, x ? "nick red" : "nick").replace(/#vip_logo#/, x ? "vip_logo" : "").replace(/#type#/g, u.loginType).replace(/#src#/g, p).replace(/#tabindex#/, t + 1).replace(/#class#/g, u.loginType == 1 ? "auth" : "hide")
      }
    }
    z = AC.innerHTML + z;
    AC.innerHTML = z;
    var w = $("qlogin_show").offsetWidth || T;
    AC.style.width = (J == 1 ? w : w / W * v) + "px";
    if (pt.plogin.isNewQr) {
      AC.style.width = (AC.offsetWidth + 4) + "px"
    }
    d = true;
    n();
    c()
  };
  var S = function(q) {
    if (q) {
      k();
      var p = K(q);
      if (p == null) {
        pt.plogin.show_err(pt.str.qlogin_expire);
        $.report.monitor(231544, 1);
        return
      } else {
        var r = G(p);
        if (g) {
          $.http.loadScript(r)
        } else {
          pt.plogin.redirect(pt.ptui.target, r)
        }
        if (pt.ptui.style == 20) {
          pt.plogin.showLoading(35)
        } else {
          pt.plogin.showLoading(10)
        }
        window.clearTimeout(pt.qlogin.qloginClock);
        pt.qlogin.qloginClock = window.setTimeout("pt.plogin.hideLoading();pt.plogin.showAssistant(0);", 10000)
      }
    }
  };
  var L = function(s, r, t) {
    var p = "";
    var u = s.split("#");
    var q = u[0].indexOf("?") > 0 ? "&" : "?";
    if (u[0].substr(u[0].length - 1, 1) == "?") {
      q = ""
    }
    if (u[1]) {
      u[1] = "#" + u[1]
    } else {
      u[1] = ""
    }
    p = u[0] + q + r + "=" + t + u[1];
    return p
  };
  var f = function(q) {
    var p = pt.ptui.s_url;
    if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable && pt.plogin.isMailLogin()) {
      p = L(p, "ss", 1)
    }
    if (pt.plogin.isMailLogin() && q) {
      p = L(p, "account", encodeURIComponent(q))
    }
    return p
  };
  var G = function(p) {
    var q = (pt.ptui.isHttps ? "https://ssl.ptlogin2." : "http://ptlogin2.") + pt.ptui.domain + "/" + (pt.ptui.jumpname || "jump") + "?";
    if (pt.ptui.regmaster == 2) {
      q = "http://ptlogin2.function.qq.com/jump?regmaster=2&"
    } else {
      if (pt.ptui.regmaster == 3) {
        q = "http://ptlogin2.crm2.qq.com/jump?regmaster=3&"
      }
    }
    q += "clientuin=" + p.uin + "&clientkey=" + p.key + "&keyindex=" + Z + "&pt_aid=" + pt.ptui.appid + (pt.ptui.daid ? "&daid=" + pt.ptui.daid : "") + "&u1=" + encodeURIComponent(f());
    if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable && !pt.plogin.isMailLogin()) {
      q += "&low_login_enable=1&low_login_hour=" + pt.plogin.low_login_hour
    }
    if (pt.ptui.csimc != "0" && pt.ptui.csimc) {
      q += "&csimc=" + pt.ptui.csimc + "&csnum=" + pt.ptui.csnum + "&authid=" + pt.ptui.authid
    }
    if (pt.ptui.pt_qzone_sig == "1") {
      q += "&pt_qzone_sig=1"
    }
    if (pt.ptui.pt_light == "1") {
      q += "&pt_light=1"
    }
    if (g) {
      q += "&ptopt=1"
    }
    return q
  };
  var V = function() {
    var p = M();
    pt.plogin.redirect(pt.ptui.target, p);
    if (pt.ptui.style == 20) {
      pt.plogin.showLoading(35)
    } else {
      pt.plogin.showLoading(10)
    }
  };
  var M = function() {
    var p = pt.plogin.authSubmitUrl;
    p += "&regmaster=" + pt.ptui.regmaster + "&aid=" + pt.ptui.appid + "&s_url=" + encodeURIComponent(f());
    if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable) {
      p += "&low_login_enable=1&low_login_hour=" + pt.plogin.low_login_hour
    }
    if (pt.ptui.pt_light == "1") {
      p += "&pt_light=1"
    }
    return p
  };
  var I = function(p) {
    p.onerror = null;
    if (p.src != pt.plogin.dftImg) {
      p.src = pt.plogin.dftImg
    }
    return false
  };
  var B = function(p) {
    var r = p.getAttribute("type");
    var q = p.getAttribute("uin");
    switch (r) {
      case "1":
        V();
        break;
      case "2":
        S(q);
        break
    }
  };
  var F = function(p) {
    if (!p) {
      return
    }
    var q = p.getAttribute("uin");
    if (q) {
      $("img_out_" + q).className = "img_out_focus"
    }
  };
  var U = function(p) {
    if (!p) {
      return
    }
    var q = p.getAttribute("uin");
    if (q) {
      $("img_out_" + q).className = "img_out"
    }
  };
  var b = function(p) {
    if (!p) {
      return
    }
    if (E != p) {
      U(E);
      E = p
    }
    F(p)
  };
  var D = function(p) {
    if (!p) {
      return
    }
    var q = p.getAttribute("uin");
    var r = $("mengban_" + q);
    r && (r.className = "face_mengban")
  };
  var O = function(p) {
    if (!p) {
      return
    }
    var q = p.getAttribute("uin");
    var r = $("mengban_" + q);
    r && (r.className = "")
  };
  var n = function() {
    var q = $("qlogin_list");
    var p = q.getElementsByTagName("a");
    if (p.length > 0) {
      E = p[0]
    }
  };
  var c = function() {
    try {
      E.focus()
    } catch (p) {
    }
  };
  var X = function() {
    /*var q = $("prePage");
    var p = $("nextPage");
    if (q) {
      $.e.add(q, "click", function(r) {
        A(1)
      })
    }
    if (p) {
      $.e.add(p, "click", function(r) {
        A(2)
      })
    }*/
  };
  var C = function() {
    var q = Y.length;
    for (var p = 0; p < q; p++) {
      if (Y[p].uinString) {
        $.http.loadScript((pt.ptui.isHttps ? "https://ssl.ptlogin2." : "http://ptlogin2.") + pt.ptui.domain + "/getface?appid=" + pt.ptui.appid + "&imgtype=3&encrytype=0&devtype=0&keytpye=0&uin=" + Y[p].uinString + "&r=" + Math.random())
      }
    }
  };
  var H = function() {
    X()
  };
  H();
  return {qloginInit: H,hasBuildQlogin: d,buildQloginList: m,imgClick: B,imgFocus: F,imgBlur: U,imgMouseover: b,imgMouseDowm: D,imgMouseUp: O,imgErr: I,focusHeader: c,initFace: C,authLoginSubmit: V,qloginClock: l,getSurl: f}
}();
module.exports=pt;