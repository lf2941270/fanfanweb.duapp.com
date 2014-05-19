var $ = window.Simple = function(a) {
  return typeof (a) == "string" ? document.getElementById(a) : a
};
$.cookie = {get: function(b) {
  var a = document.cookie.match(new RegExp("(^| )" + b + "=([^;]*)(;|$)"));
  return !a ? "" : decodeURIComponent(a[2])
},getOrigin: function(b) {
  var a = document.cookie.match(new RegExp("(^| )" + b + "=([^;]*)(;|$)"));
  return !a ? "" : (a[2])
},set: function(c, f, d, g, a) {
  var b = new Date();
  if (a) {
    b.setTime(b.getTime() + 3600000 * a);
    document.cookie = c + "=" + f + "; expires=" + b.toGMTString() + "; path=" + (g ? g : "/") + "; " + (d ? ("domain=" + d + ";") : "")
  } else {
    document.cookie = c + "=" + f + "; path=" + (g ? g : "/") + "; " + (d ? ("domain=" + d + ";") : "")
  }
},del: function(a, b, c) {
  document.cookie = a + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + (c ? c : "/") + "; " + (b ? ("domain=" + b + ";") : "")
},uin: function() {
  var a = $.cookie.get("uin");
  return !a ? null : parseInt(a.substring(1, a.length), 10)
}};
$.http = {getXHR: function() {
  return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest()
},ajax: function(url, para, cb, method, type) {
  var xhr = $.http.getXHR();
  xhr.open(method, url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || xhr.status === 1223 || xhr.status === 0) {
        if (typeof (type) == "undefined" && xhr.responseText) {
          cb(eval("(" + xhr.responseText + ")"))
        } else {
          cb(xhr.responseText);
          if ((!xhr.responseText) && $.badjs._smid) {
            $.badjs("HTTP Empty[xhr.status]:" + xhr.status, url, 0, $.badjs._smid)
          }
        }
      } else {
        if ($.badjs._smid) {
          $.badjs("HTTP Error[xhr.status]:" + xhr.status, url, 0, $.badjs._smid)
        }
      }
      xhr = null
    }
  };
  xhr.send(para);
  return xhr
},post: function(c, b, a, g) {
  var f = "";
  for (var d in b) {
    f += "&" + d + "=" + b[d]
  }
  return $.http.ajax(c, f, a, "POST", g)
},get: function(c, b, a, f) {
  var g = [];
  for (var d in b) {
    g.push(d + "=" + b[d])
  }
  if (c.indexOf("?") == -1) {
    c += "?"
  }
  c += g.join("&");
  return $.http.ajax(c, null, a, "GET", f)
},jsonp: function(a) {
  var b = document.createElement("script");
  b.src = a;
  document.getElementsByTagName("head")[0].appendChild(b)
},loadScript: function(c, d, b) {
  var a = document.createElement("script");
  a.onload = a.onreadystatechange = function() {
    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
      if (typeof d == "function") {
        d()
      }
      a.onload = a.onreadystatechange = null;
      if (a.parentNode) {
        a.parentNode.removeChild(a)
      }
    }
  };
  a.src = c;
  document.getElementsByTagName("head")[0].appendChild(a)
},preload: function(a) {
  var b = document.createElement("img");
  b.src = a;
  b = null
}};
$.get = $.http.get;
$.post = $.http.post;
$.jsonp = $.http.jsonp;
$.browser = function(b) {
  if (typeof $.browser.info == "undefined") {
    var a = {type: ""};
    var c = navigator.userAgent.toLowerCase();
    if (/webkit/.test(c)) {
      a = {type: "webkit",version: /webkit[\/ ]([\w.]+)/}
    } else {
      if (/opera/.test(c)) {
        a = {type: "opera",version: /version/.test(c) ? /version[\/ ]([\w.]+)/ : /opera[\/ ]([\w.]+)/}
      } else {
        if (/msie/.test(c)) {
          a = {type: "msie",version: /msie ([\w.]+)/}
        } else {
          if (/mozilla/.test(c) && !/compatible/.test(c)) {
            a = {type: "ff",version: /rv:([\w.]+)/}
          }
        }
      }
    }
    a.version = (a.version && a.version.exec(c) || [0, "0"])[1];
    $.browser.info = a
  }
  return $.browser.info[b]
};
$.e = {_counter: 0,_uid: function() {
  return "h" + $.e._counter++
},add: function(c, b, g) {
  if (typeof c != "object") {
    c = $(c)
  }
  if (document.addEventListener) {
    c.addEventListener(b, g, false)
  } else {
    if (document.attachEvent) {
      if ($.e._find(c, b, g) != -1) {
        return
      }
      var j = function(h) {
        if (!h) {
          h = window.event
        }
        var d = {_event: h,type: h.type,target: h.srcElement,currentTarget: c,relatedTarget: h.fromElement ? h.fromElement : h.toElement,eventPhase: (h.srcElement == c) ? 2 : 3,clientX: h.clientX,clientY: h.clientY,screenX: h.screenX,screenY: h.screenY,altKey: h.altKey,ctrlKey: h.ctrlKey,shiftKey: h.shiftKey,keyCode: h.keyCode,data: h.data,origin: h.origin,stopPropagation: function() {
          this._event.cancelBubble = true
        },preventDefault: function() {
          this._event.returnValue = false
        }};
        if (Function.prototype.call) {
          g.call(c, d)
        } else {
          c._currentHandler = g;
          c._currentHandler(d);
          c._currentHandler = null
        }
      };
      c.attachEvent("on" + b, j);
      var f = {element: c,eventType: b,handler: g,wrappedHandler: j};
      var k = c.document || c;
      var a = k.parentWindow;
      var l = $.e._uid();
      if (!a._allHandlers) {
        a._allHandlers = {}
      }
      a._allHandlers[l] = f;
      if (!c._handlers) {
        c._handlers = []
      }
      c._handlers.push(l);
      if (!a._onunloadHandlerRegistered) {
        a._onunloadHandlerRegistered = true;
        a.attachEvent("onunload", $.e._removeAllHandlers)
      }
    }
  }
},remove: function(f, c, j) {
  if (document.addEventListener) {
    f.removeEventListener(c, j, false)
  } else {
    if (document.attachEvent) {
      var b = $.e._find(f, c, j);
      if (b == -1) {
        return
      }
      var l = f.document || f;
      var a = l.parentWindow;
      var k = f._handlers[b];
      var g = a._allHandlers[k];
      f.detachEvent("on" + c, g.wrappedHandler);
      f._handlers.splice(b, 1);
      delete a._allHandlers[k]
    }
  }
},_find: function(f, a, m) {
  var b = f._handlers;
  if (!b) {
    return -1
  }
  var k = f.document || f;
  var l = k.parentWindow;
  for (var g = b.length - 1; g >= 0; g--) {
    var c = b[g];
    var j = l._allHandlers[c];
    if (j.eventType == a && j.handler == m) {
      return g
    }
  }
  return -1
},_removeAllHandlers: function() {
  var a = this;
  for (id in a._allHandlers) {
    var b = a._allHandlers[id];
    b.element.detachEvent("on" + b.eventType, b.wrappedHandler);
    delete a._allHandlers[id]
  }
},src: function(a) {
  return a ? a.target : event.srcElement
},stopPropagation: function(a) {
  a ? a.stopPropagation() : event.cancelBubble = true
},trigger: function(c, b) {
  var f = {HTMLEvents: "abort,blur,change,error,focus,load,reset,resize,scroll,select,submit,unload",UIEevents: "keydown,keypress,keyup",MouseEvents: "click,mousedown,mousemove,mouseout,mouseover,mouseup"};
  if (document.createEvent) {
    var d = "";
    (b == "mouseleave") && (b = "mouseout");
    (b == "mouseenter") && (b = "mouseover");
    for (var g in f) {
      if (f[g].indexOf(b)) {
        d = g;
        break
      }
    }
    var a = document.createEvent(d);
    a.initEvent(b, true, false);
    c.dispatchEvent(a)
  } else {
    if (document.createEventObject) {
      c.fireEvent("on" + b)
    }
  }
}};
$.bom = {query: function(b) {
  var a = window.location.search.match(new RegExp("(\\?|&)" + b + "=([^&]*)(&|$)"));
  return !a ? "" : decodeURIComponent(a[2])
},getHash: function(b) {
  var a = window.location.hash.match(new RegExp("(#|&)" + b + "=([^&]*)(&|$)"));
  return !a ? "" : decodeURIComponent(a[2])
}};
$.winName = {set: function(c, a) {
  var b = window.name || "";
  if (b.match(new RegExp(";" + c + "=([^;]*)(;|$)"))) {
    window.name = b.replace(new RegExp(";" + c + "=([^;]*)"), ";" + c + "=" + a)
  } else {
    window.name = b + ";" + c + "=" + a
  }
},get: function(c) {
  var b = window.name || "";
  var a = b.match(new RegExp(";" + c + "=([^;]*)(;|$)"));
  return a ? a[1] : ""
},clear: function(b) {
  var a = window.name || "";
  window.name = a.replace(new RegExp(";" + b + "=([^;]*)"), "")
}};
$.localData = function() {
  var a = "ptlogin2.qq.com";
  var d = /^[0-9A-Za-z_-]*$/;
  var b;
  function c() {
    var h = document.createElement("link");
    h.style.display = "none";
    h.id = a;
    document.getElementsByTagName("head")[0].appendChild(h);
    h.addBehavior("#default#userdata");
    return h
  }
  function f() {
    if (typeof b == "undefined") {
      if (window.localStorage) {
        b = localStorage
      } else {
        try {
          b = c();
          b.load(a)
        } catch (h) {
          b = false;
          return false
        }
      }
    }
    return true
  }
  function g(h) {
    if (typeof h != "string") {
      return false
    }
    return d.test(h)
  }
  return {set: function(h, j) {
    var l = false;
    if (g(h) && f()) {
      try {
        j += "";
        if (window.localStorage) {
          b.setItem(h, j);
          l = true
        } else {
          b.setAttribute(h, j);
          b.save(a);
          l = b.getAttribute(h) === j
        }
      } catch (k) {
      }
    }
    return l
  },get: function(h) {
    if (g(h) && f()) {
      try {
        return window.localStorage ? b.getItem(h) : b.getAttribute(h)
      } catch (j) {
      }
    }
    return null
  },remove: function(h) {
    if (g(h) && f()) {
      try {
        window.localStorage ? b.removeItem(h) : b.removeAttribute(h);
        return true
      } catch (j) {
      }
    }
    return false
  }}
}();
$.str = (function() {
  var htmlDecodeDict = {quot: '"',lt: "<",gt: ">",amp: "&",nbsp: " ","#34": '"',"#60": "<","#62": ">","#38": "&","#160": " "};
  var htmlEncodeDict = {'"': "#34","<": "#60",">": "#62","&": "#38"," ": "#160"};
  return {decodeHtml: function(s) {
    s += "";
    return s.replace(/&(quot|lt|gt|amp|nbsp);/ig, function(all, key) {
      return htmlDecodeDict[key]
    }).replace(/&#u([a-f\d]{4});/ig, function(all, hex) {
          return String.fromCharCode(parseInt("0x" + hex))
        }).replace(/&#(\d+);/ig, function(all, number) {
          return String.fromCharCode(+number)
        })
  },encodeHtml: function(s) {
    s += "";
    return s.replace(/["<>& ]/g, function(all) {
      return "&" + htmlEncodeDict[all] + ";"
    })
  },trim: function(str) {
    str += "";
    var str = str.replace(/^\s+/, ""), ws = /\s/, end = str.length;
    while (ws.test(str.charAt(--end))) {
    }
    return str.slice(0, end + 1)
  },uin2hex: function(str) {
    var maxLength = 16;
    str = parseInt(str);
    var hex = str.toString(16);
    var len = hex.length;
    for (var i = len; i < maxLength; i++) {
      hex = "0" + hex
    }
    var arr = [];
    for (var j = 0; j < maxLength; j += 2) {
      arr.push("\\x" + hex.substr(j, 2))
    }
    var result = arr.join("");
    eval('result="' + result + '"');
    return result
  },bin2String: function(a) {
    var arr = [];
    for (var i = 0, len = a.length; i < len; i++) {
      var temp = a.charCodeAt(i).toString(16);
      if (temp.length == 1) {
        temp = "0" + temp
      }
      arr.push(temp)
    }
    arr = "0x" + arr.join("");
    arr = parseInt(arr, 16);
    return arr
  },utf8ToUincode: function(s) {
    var result = "";
    try {
      var length = s.length;
      var arr = [];
      for (i = 0; i < length; i += 2) {
        arr.push("%" + s.substr(i, 2))
      }
      result = decodeURIComponent(arr.join(""));
      result = $.str.decodeHtml(result)
    } catch (e) {
      result = ""
    }
    return result
  },json2str: function(obj) {
    var result = "";
    if (typeof JSON != "undefined") {
      result = JSON.stringify(obj)
    } else {
      var arr = [];
      for (var i in obj) {
        arr.push('"' + i + '":"' + obj[i] + '"')
      }
      result = "{" + arr.join(",") + "}"
    }
    return result
  },time33: function(str) {
    var hash = 0;
    for (var i = 0, length = str.length; i < length; i++) {
      hash = hash * 33 + str.charCodeAt(i)
    }
    return hash % 4294967296
  }}
})();
$.css = function() {
  var a = document.documentElement;
  return {getPageScrollTop: function() {
    return window.pageYOffset || a.scrollTop || document.body.scrollTop || 0
  },getPageScrollLeft: function() {
    return window.pageXOffset || a.scrollLeft || document.body.scrollLeft || 0
  },getOffsetPosition: function(c) {
    c = $(c);
    var f = 0, d = 0;
    if (a.getBoundingClientRect && c.getBoundingClientRect) {
      var b = c.getBoundingClientRect();
      var h = a.clientTop || document.body.clientTop || 0;
      var g = a.clientLeft || document.body.clientLeft || 0;
      f = b.top + this.getPageScrollTop() - h, d = b.left + this.getPageScrollLeft() - g
    } else {
      do {
        f += c.offsetTop || 0;
        d += c.offsetLeft || 0;
        c = c.offsetParent
      } while (c)
    }
    return {left: d,top: f}
  },getWidth: function(b) {
    return $(b).offsetWidth
  },getHeight: function(b) {
    return $(b).offsetHeight
  },show: function(b) {
    b.style.display = "block"
  },hide: function(b) {
    b.style.display = "none"
  },hasClass: function(f, g) {
    if (!f.className) {
      return false
    }
    var c = f.className.split(" ");
    for (var d = 0, b = c.length; d < b; d++) {
      if (g == c[d]) {
        return true
      }
    }
    return false
  },addClass: function(b, c) {
    $.css.updateClass(b, c, false)
  },removeClass: function(b, c) {
    $.css.updateClass(b, false, c)
  },updateClass: function(f, m, o) {
    var b = f.className.split(" ");
    var j = {}, g = 0, l = b.length;
    for (; g < l; g++) {
      b[g] && (j[b[g]] = true)
    }
    if (m) {
      var h = m.split(" ");
      for (g = 0, l = h.length; g < l; g++) {
        h[g] && (j[h[g]] = true)
      }
    }
    if (o) {
      var c = o.split(" ");
      for (g = 0, l = c.length; g < l; g++) {
        c[g] && (delete j[c[g]])
      }
    }
    var n = [];
    for (var d in j) {
      n.push(d)
    }
    f.className = n.join(" ")
  },setClass: function(c, b) {
    c.className = b
  }}
}();
$.animate = {fade: function(d, j, b, f, n) {
  d = $(d);
  if (!d) {
    return
  }
  if (!d.effect) {
    d.effect = {}
  }
  var g = Object.prototype.toString.call(j);
  var c = 100;
  if (!isNaN(j)) {
    c = j
  } else {
    if (g == "[object Object]") {
      if (j) {
        if (j.to) {
          if (!isNaN(j.to)) {
            c = j.to
          }
          if (!isNaN(j.from)) {
            d.style.opacity = j.from / 100;
            d.style.filter = "alpha(opacity=" + j.from + ")"
          }
        }
      }
    }
  }
  if (typeof (d.effect.fade) == "undefined") {
    d.effect.fade = 0
  }
  window.clearInterval(d.effect.fade);
  var b = b || 1, f = f || 20, h = window.navigator.userAgent.toLowerCase(), m = function(o) {
    var q;
    if (h.indexOf("msie") != -1) {
      var p = (o.currentStyle || {}).filter || "";
      q = p.indexOf("opacity") >= 0 ? (parseFloat(p.match(/opacity=([^)]*)/)[1])) + "" : "100"
    } else {
      var r = o.ownerDocument.defaultView;
      r = r && r.getComputedStyle;
      q = 100 * (r && r(o, null)["opacity"] || 1)
    }
    return parseFloat(q)
  }, a = m(d), k = a < c ? 1 : -1;
  if (h.indexOf("msie") != -1) {
    if (f < 15) {
      b = Math.floor((b * 15) / f);
      f = 15
    }
  }
  var l = function() {
    a = a + b * k;
    if ((Math.round(a) - c) * k >= 0) {
      d.style.opacity = c / 100;
      d.style.filter = "alpha(opacity=" + c + ")";
      window.clearInterval(d.effect.fade);
      if (typeof (n) == "function") {
        n(d)
      }
    } else {
      d.style.opacity = a / 100;
      d.style.filter = "alpha(opacity=" + a + ")"
    }
  };
  d.effect.fade = window.setInterval(l, f)
},animate: function(b, c, j, t, h) {
  b = $(b);
  if (!b) {
    return
  }
  if (!b.effect) {
    b.effect = {}
  }
  if (typeof (b.effect.animate) == "undefined") {
    b.effect.animate = 0
  }
  for (var o in c) {
    c[o] = parseInt(c[o]) || 0
  }
  window.clearInterval(b.effect.animate);
  var j = j || 10, t = t || 20, k = function(x) {
    var w = {left: x.offsetLeft,top: x.offsetTop};
    return w
  }, v = k(b), g = {width: b.clientWidth,height: b.clientHeight,left: v.left,top: v.top}, d = [], s = window.navigator.userAgent.toLowerCase();
  if (!(s.indexOf("msie") != -1 && document.compatMode == "BackCompat")) {
    var m = document.defaultView ? document.defaultView.getComputedStyle(b, null) : b.currentStyle;
    var f = c.width || c.width == 0 ? parseInt(c.width) : null, u = c.height || c.height == 0 ? parseInt(c.height) : null;
    if (typeof (f) == "number") {
      d.push("width");
      c.width = f - m.paddingLeft.replace(/\D/g, "") - m.paddingRight.replace(/\D/g, "")
    }
    if (typeof (u) == "number") {
      d.push("height");
      c.height = u - m.paddingTop.replace(/\D/g, "") - m.paddingBottom.replace(/\D/g, "")
    }
    if (t < 15) {
      j = Math.floor((j * 15) / t);
      t = 15
    }
  }
  var r = c.left || c.left == 0 ? parseInt(c.left) : null, n = c.top || c.top == 0 ? parseInt(c.top) : null;
  if (typeof (r) == "number") {
    d.push("left");
    b.style.position = "absolute"
  }
  if (typeof (n) == "number") {
    d.push("top");
    b.style.position = "absolute"
  }
  var l = [], q = d.length;
  for (var o = 0; o < q; o++) {
    l[d[o]] = g[d[o]] < c[d[o]] ? 1 : -1
  }
  var p = b.style;
  var a = function() {
    var w = true;
    for (var x = 0; x < q; x++) {
      g[d[x]] = g[d[x]] + l[d[x]] * Math.abs(c[d[x]] - g[d[x]]) * j / 100;
      if ((Math.round(g[d[x]]) - c[d[x]]) * l[d[x]] >= 0) {
        w = w && true;
        p[d[x]] = c[d[x]] + "px"
      } else {
        w = w && false;
        p[d[x]] = g[d[x]] + "px"
      }
    }
    if (w) {
      window.clearInterval(b.effect.animate);
      if (typeof (h) == "function") {
        h(b)
      }
    }
  };
  b.effect.animate = window.setInterval(a, t)
}};
$.check = {isHttps: function() {
  return document.location.protocol == "https:"
},isSsl: function() {
  var a = document.location.host;
  return /^ssl./i.test(a)
},isIpad: function() {
  var a = navigator.userAgent.toLowerCase();
  return /ipad/i.test(a)
},isQQ: function(a) {
  return /^[1-9]{1}\d{4,9}$/.test(a)
},isQQMail: function(a) {
  return /^[1-9]{1}\d{4,9}@qq\.com$/.test(a)
},isNullQQ: function(a) {
  return /^\d{1,4}$/.test(a)
},isNick: function(a) {
  return /^[a-zA-Z]{1}([a-zA-Z0-9]|[-_]){0,19}$/.test(a)
},isName: function(a) {
  return /[\u4E00-\u9FA5]{1,8}/.test(a)
},isPhone: function(a) {
  return /^(?:86|886|)1\d{10}\s*$/.test(a)
},isDXPhone: function(a) {
  return /^(?:86|886|)1(?:33|53|80|81|89)\d{8}$/.test(a)
},isSeaPhone: function(a) {
  return /^(00)?(?:852|853|886(0)?\d{1})\d{8}$/.test(a)
},isMail: function(a) {
  return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(a)
},isQiyeQQ800: function(a) {
  return /^(800)\d{7}$/.test(a)
},isPassword: function(a) {
  return a && a.length >= 16
},isForeignPhone: function(a) {
  return /^00\d{7,}/.test(a)
},needVip: function(f) {
  var a = ["21001601", "21000110", "21000121", "46000101", "716027609", "716027610", "549000912"];
  var b = true;
  for (var c = 0, d = a.length; c < d; c++) {
    if (a[c] == f) {
      b = false;
      break
    }
  }
  return b
},isPaipai: function() {
  return /paipai.com$/.test(window.location.hostname)
},is_weibo_appid: function(a) {
  if (a == 46000101 || a == 607000101 || a == 558032501) {
    return true
  }
  return false
}};
$.report = {monitor: function(c, b) {
  if (Math.random() > (b || 1)) {
    return
  }
  var a = location.protocol + "//ui.ptlogin2.qq.com/cgi-bin/report?id=" + c;
  $.http.preload(a)
},nlog: function(f, b) {
  var a = "http://badjs.qq.com/cgi-bin/js_report?";
  if ($.check.isHttps()) {
    a = "https://ssl.qq.com//badjs/cgi-bin/js_report?"
  }
  var c = location.href;
  var d = encodeURIComponent(f + "|_|" + c + "|_|" + window.navigator.userAgent);
  a += ("bid=110&level=2&mid=" + b + "&msg=" + d + "&v=" + Math.random());
  $.http.preload(a)
},simpleIsdSpeed: function(a, c) {
  if (Math.random() < (c || 1)) {
    var b = "http://isdspeed.qq.com/cgi-bin/r.cgi?";
    if ($.check.isHttps()) {
      b = "https://login.qq.com/cgi-bin/r.cgi?"
    }
    b += a;
    $.http.preload(b)
  }
},isdSpeed: function(a, g) {
  var b = false;
  var d = "http://isdspeed.qq.com/cgi-bin/r.cgi?";
  if ($.check.isHttps()) {
    d = "https://login.qq.com/cgi-bin/r.cgi?"
  }
  d += a;
  if (Math.random() < (g || 1)) {
    var c = $.report.getSpeedPoints(a);
    for (var f in c) {
      if (c[f] && c[f] < 30000) {
        d += ("&" + f + "=" + c[f]);
        b = true
      }
    }
    d += "&v=" + Math.random();
    if (b) {
      $.http.preload(d)
    }
  }
  $.report.setSpeedPoint(a)
},speedPoints: {},basePoint: {},setBasePoint: function(a, b) {
  $.report.basePoint[a] = b
},setSpeedPoint: function(a, b, c) {
  if (!b) {
    $.report.speedPoints[a] = {}
  } else {
    if (!$.report.speedPoints[a]) {
      $.report.speedPoints[a] = {}
    }
    $.report.speedPoints[a][b] = c - $.report.basePoint[a]
  }
},setSpeedPoints: function(a, b) {
  $.report.speedPoints[a] = b
},getSpeedPoints: function(a) {
  return $.report.speedPoints[a]
}};
$.sso_ver = 0;
$.sso_state = 0;
$.plugin_isd_flag = "";
$.nptxsso = null;
$.activetxsso = null;
$.sso_loadComplete = true;
$.np_clock = 0;
$.loginQQnum = 0;
$.suportActive = function() {
  var a = true;
  try {
    if (window.ActiveXObject || window.ActiveXObject.prototype) {
      a = true;
      if (window.ActiveXObject.prototype && !window.ActiveXObject) {
        $.report.nlog("activeobject 判断有问题")
      }
    } else {
      a = false
    }
  } catch (b) {
    a = false
  }
  return a
};
$.getLoginQQNum = function() {
  try {
    var f = 0;
    if ($.suportActive()) {
      $.plugin_isd_flag = "flag1=7808&flag2=1&flag3=20";
      $.report.setBasePoint($.plugin_isd_flag, new Date());
      var l = new ActiveXObject("SSOAxCtrlForPTLogin.SSOForPTLogin2");
      $.activetxsso = l;
      var b = l.CreateTXSSOData();
      l.InitSSOFPTCtrl(0, b);
      var a = l.DoOperation(2, b);
      var d = a.GetArray("PTALIST");
      f = d.GetSize();
      try {
        var c = l.QuerySSOInfo(1);
        $.sso_ver = c.GetInt("nSSOVersion")
      } catch (g) {
        $.sso_ver = 0
      }
    } else {
      if (navigator.mimeTypes["application/nptxsso"]) {
        $.plugin_isd_flag = "flag1=7808&flag2=1&flag3=21";
        $.report.setBasePoint($.plugin_isd_flag, (new Date()).getTime());
        if (!$.nptxsso) {
          $.nptxsso = document.createElement("embed");
          $.nptxsso.type = "application/nptxsso";
          $.nptxsso.style.width = "0px";
          $.nptxsso.style.height = "0px";
          document.body.appendChild($.nptxsso)
        }
        if (typeof $.nptxsso.InitPVANoST != "function") {
          $.sso_loadComplete = false;
          $.report.nlog("没有找到插件的InitPVANoST方法", 269929)
        } else {
          var j = $.nptxsso.InitPVANoST();
          if (j) {
            f = $.nptxsso.GetPVACount();
            $.sso_loadComplete = true
          }
          try {
            $.sso_ver = $.nptxsso.GetSSOVersion()
          } catch (g) {
            $.sso_ver = 0
          }
        }
      } else {
        $.report.nlog("插件没有注册成功", 263744);
        $.sso_state = 2
      }
    }
  } catch (g) {
    var k = null;
    try {
      k = $.http.getXHR()
    } catch (g) {
      return 0
    }
    var h = g.message || g;
    if (/^pt_windows_sso/.test(h)) {
      if (/^pt_windows_sso_\d+_3/.test(h)) {
        $.report.nlog("QQ插件不支持该url" + g.message, 326044)
      } else {
        $.report.nlog("QQ插件抛出内部错误" + g.message, 325361)
      }
      $.sso_state = 1
    } else {
      if (k) {
        $.report.nlog("可能没有安装QQ" + g.message, 322340);
        $.sso_state = 2
      } else {
        $.report.nlog("获取登录QQ号码出错" + g.message, 263745);
        if (window.ActiveXObject) {
          $.sso_state = 1
        }
      }
    }
    return 0
  }
  $.loginQQnum = f;
  return f
};
$.checkNPPlugin = function() {
  var a = 10;
  window.clearInterval($.np_clock);
  $.np_clock = window.setInterval(function() {
    if (typeof $.nptxsso.InitPVANoST == "function" || a == 0) {
      window.clearInterval($.np_clock);
      if (typeof $.nptxsso.InitPVANoST == "function") {
        pt.plogin.auth()
      }
    } else {
      a--
    }
  }, 200)
};
$.guanjiaPlugin = null;
$.initGuanjiaPlugin = function() {
  try {
    if (window.ActiveXObject) {
      $.guanjiaPlugin = new ActiveXObject("npQMExtensionsIE.Basic")
    } else {
      if (navigator.mimeTypes["application/qqpcmgr-extensions-mozilla"]) {
        $.guanjiaPlugin = document.createElement("embed");
        $.guanjiaPlugin.type = "application/qqpcmgr-extensions-mozilla";
        $.guanjiaPlugin.style.width = "0px";
        $.guanjiaPlugin.style.height = "0px";
        document.body.appendChild($.guanjiaPlugin)
      }
    }
    var a = $.guanjiaPlugin.QMGetVersion().split(".");
    if (a.length == 4 && a[2] >= 9319) {
    } else {
      $.guanjiaPlugin = null
    }
  } catch (b) {
    $.guanjiaPlugin = null
  }
};
function pluginBegin() {
  if (!$.sso_loadComplete) {
    try {
      $.checkNPPlugin()
    } catch (a) {
    }
  }
  $.sso_loadComplete = true;
  $.report.setSpeedPoint($.plugin_isd_flag, 1, (new Date()).getTime());
  window.setTimeout(function(b) {
    $.report.isdSpeed($.plugin_isd_flag, 0.05)
  }, 2000)
}
(function() {
  var a = "nohost_guid";
  var b = "/nohost_htdocs/js/SwitchHost.js";
  if ($.cookie.get(a) != "") {
    $.http.loadScript(b, function() {
      var c = window.SwitchHost && window.SwitchHost.init;
      c && c()
    })
  }
})();
$.RSA = function() {
  function h(z, t) {
    return new au(z, t)
  }
  function aj(aC, aD) {
    var t = "";
    var z = 0;
    while (z + aD < aC.length) {
      t += aC.substring(z, z + aD) + "\n";
      z += aD
    }
    return t + aC.substring(z, aC.length)
  }
  function u(t) {
    if (t < 16) {
      return "0" + t.toString(16)
    } else {
      return t.toString(16)
    }
  }
  function ah(aD, aG) {
    if (aG < aD.length + 11) {
      uv_alert("Message too long for RSA");
      return null
    }
    var aF = new Array();
    var aC = aD.length - 1;
    while (aC >= 0 && aG > 0) {
      var aE = aD.charCodeAt(aC--);
      if (aE < 128) {
        aF[--aG] = aE
      } else {
        if ((aE > 127) && (aE < 2048)) {
          aF[--aG] = (aE & 63) | 128;
          aF[--aG] = (aE >> 6) | 192
        } else {
          aF[--aG] = (aE & 63) | 128;
          aF[--aG] = ((aE >> 6) & 63) | 128;
          aF[--aG] = (aE >> 12) | 224
        }
      }
    }
    aF[--aG] = 0;
    var z = new af();
    var t = new Array();
    while (aG > 2) {
      t[0] = 0;
      while (t[0] == 0) {
        z.nextBytes(t)
      }
      aF[--aG] = t[0]
    }
    aF[--aG] = 2;
    aF[--aG] = 0;
    return new au(aF)
  }
  function N() {
    this.n = null;
    this.e = 0;
    this.d = null;
    this.p = null;
    this.q = null;
    this.dmp1 = null;
    this.dmq1 = null;
    this.coeff = null
  }
  function q(z, t) {
    if (z != null && t != null && z.length > 0 && t.length > 0) {
      this.n = h(z, 16);
      this.e = parseInt(t, 16)
    } else {
      uv_alert("Invalid RSA public key")
    }
  }
  function Y(t) {
    return t.modPowInt(this.e, this.n)
  }
  function r(aC) {
    var t = ah(aC, (this.n.bitLength() + 7) >> 3);
    if (t == null) {
      return null
    }
    var aD = this.doPublic(t);
    if (aD == null) {
      return null
    }
    var z = aD.toString(16);
    if ((z.length & 1) == 0) {
      return z
    } else {
      return "0" + z
    }
  }
  N.prototype.doPublic = Y;
  N.prototype.setPublic = q;
  N.prototype.encrypt = r;
  var ay;
  var ak = 244837814094590;
  var ab = ((ak & 16777215) == 15715070);
  function au(z, t, aC) {
    if (z != null) {
      if ("number" == typeof z) {
        this.fromNumber(z, t, aC)
      } else {
        if (t == null && "string" != typeof z) {
          this.fromString(z, 256)
        } else {
          this.fromString(z, t)
        }
      }
    }
  }
  function j() {
    return new au(null)
  }
  function b(aE, t, z, aD, aG, aF) {
    while (--aF >= 0) {
      var aC = t * this[aE++] + z[aD] + aG;
      aG = Math.floor(aC / 67108864);
      z[aD++] = aC & 67108863
    }
    return aG
  }
  function aA(aE, aJ, aK, aD, aH, t) {
    var aG = aJ & 32767, aI = aJ >> 15;
    while (--t >= 0) {
      var aC = this[aE] & 32767;
      var aF = this[aE++] >> 15;
      var z = aI * aC + aF * aG;
      aC = aG * aC + ((z & 32767) << 15) + aK[aD] + (aH & 1073741823);
      aH = (aC >>> 30) + (z >>> 15) + aI * aF + (aH >>> 30);
      aK[aD++] = aC & 1073741823
    }
    return aH
  }
  function az(aE, aJ, aK, aD, aH, t) {
    var aG = aJ & 16383, aI = aJ >> 14;
    while (--t >= 0) {
      var aC = this[aE] & 16383;
      var aF = this[aE++] >> 14;
      var z = aI * aC + aF * aG;
      aC = aG * aC + ((z & 16383) << 14) + aK[aD] + aH;
      aH = (aC >> 28) + (z >> 14) + aI * aF;
      aK[aD++] = aC & 268435455
    }
    return aH
  }
  if (ab && (navigator.appName == "Microsoft Internet Explorer")) {
    au.prototype.am = aA;
    ay = 30
  } else {
    if (ab && (navigator.appName != "Netscape")) {
      au.prototype.am = b;
      ay = 26
    } else {
      au.prototype.am = az;
      ay = 28
    }
  }
  au.prototype.DB = ay;
  au.prototype.DM = ((1 << ay) - 1);
  au.prototype.DV = (1 << ay);
  var ac = 52;
  au.prototype.FV = Math.pow(2, ac);
  au.prototype.F1 = ac - ay;
  au.prototype.F2 = 2 * ay - ac;
  var ag = "0123456789abcdefghijklmnopqrstuvwxyz";
  var ai = new Array();
  var ar, x;
  ar = "0".charCodeAt(0);
  for (x = 0; x <= 9; ++x) {
    ai[ar++] = x
  }
  ar = "a".charCodeAt(0);
  for (x = 10; x < 36; ++x) {
    ai[ar++] = x
  }
  ar = "A".charCodeAt(0);
  for (x = 10; x < 36; ++x) {
    ai[ar++] = x
  }
  function aB(t) {
    return ag.charAt(t)
  }
  function C(z, t) {
    var aC = ai[z.charCodeAt(t)];
    return (aC == null) ? -1 : aC
  }
  function aa(z) {
    for (var t = this.t - 1; t >= 0; --t) {
      z[t] = this[t]
    }
    z.t = this.t;
    z.s = this.s
  }
  function p(t) {
    this.t = 1;
    this.s = (t < 0) ? -1 : 0;
    if (t > 0) {
      this[0] = t
    } else {
      if (t < -1) {
        this[0] = t + DV
      } else {
        this.t = 0
      }
    }
  }
  function c(t) {
    var z = j();
    z.fromInt(t);
    return z
  }
  function y(aG, z) {
    var aD;
    if (z == 16) {
      aD = 4
    } else {
      if (z == 8) {
        aD = 3
      } else {
        if (z == 256) {
          aD = 8
        } else {
          if (z == 2) {
            aD = 1
          } else {
            if (z == 32) {
              aD = 5
            } else {
              if (z == 4) {
                aD = 2
              } else {
                this.fromRadix(aG, z);
                return
              }
            }
          }
        }
      }
    }
    this.t = 0;
    this.s = 0;
    var aF = aG.length, aC = false, aE = 0;
    while (--aF >= 0) {
      var t = (aD == 8) ? aG[aF] & 255 : C(aG, aF);
      if (t < 0) {
        if (aG.charAt(aF) == "-") {
          aC = true
        }
        continue
      }
      aC = false;
      if (aE == 0) {
        this[this.t++] = t
      } else {
        if (aE + aD > this.DB) {
          this[this.t - 1] |= (t & ((1 << (this.DB - aE)) - 1)) << aE;
          this[this.t++] = (t >> (this.DB - aE))
        } else {
          this[this.t - 1] |= t << aE
        }
      }
      aE += aD;
      if (aE >= this.DB) {
        aE -= this.DB
      }
    }
    if (aD == 8 && (aG[0] & 128) != 0) {
      this.s = -1;
      if (aE > 0) {
        this[this.t - 1] |= ((1 << (this.DB - aE)) - 1) << aE
      }
    }
    this.clamp();
    if (aC) {
      au.ZERO.subTo(this, this)
    }
  }
  function Q() {
    var t = this.s & this.DM;
    while (this.t > 0 && this[this.t - 1] == t) {
      --this.t
    }
  }
  function s(z) {
    if (this.s < 0) {
      return "-" + this.negate().toString(z)
    }
    var aC;
    if (z == 16) {
      aC = 4
    } else {
      if (z == 8) {
        aC = 3
      } else {
        if (z == 2) {
          aC = 1
        } else {
          if (z == 32) {
            aC = 5
          } else {
            if (z == 4) {
              aC = 2
            } else {
              return this.toRadix(z)
            }
          }
        }
      }
    }
    var aE = (1 << aC) - 1, aH, t = false, aF = "", aD = this.t;
    var aG = this.DB - (aD * this.DB) % aC;
    if (aD-- > 0) {
      if (aG < this.DB && (aH = this[aD] >> aG) > 0) {
        t = true;
        aF = aB(aH)
      }
      while (aD >= 0) {
        if (aG < aC) {
          aH = (this[aD] & ((1 << aG) - 1)) << (aC - aG);
          aH |= this[--aD] >> (aG += this.DB - aC)
        } else {
          aH = (this[aD] >> (aG -= aC)) & aE;
          if (aG <= 0) {
            aG += this.DB;
            --aD
          }
        }
        if (aH > 0) {
          t = true
        }
        if (t) {
          aF += aB(aH)
        }
      }
    }
    return t ? aF : "0"
  }
  function T() {
    var t = j();
    au.ZERO.subTo(this, t);
    return t
  }
  function an() {
    return (this.s < 0) ? this.negate() : this
  }
  function I(t) {
    var aC = this.s - t.s;
    if (aC != 0) {
      return aC
    }
    var z = this.t;
    aC = z - t.t;
    if (aC != 0) {
      return aC
    }
    while (--z >= 0) {
      if ((aC = this[z] - t[z]) != 0) {
        return aC
      }
    }
    return 0
  }
  function l(z) {
    var aD = 1, aC;
    if ((aC = z >>> 16) != 0) {
      z = aC;
      aD += 16
    }
    if ((aC = z >> 8) != 0) {
      z = aC;
      aD += 8
    }
    if ((aC = z >> 4) != 0) {
      z = aC;
      aD += 4
    }
    if ((aC = z >> 2) != 0) {
      z = aC;
      aD += 2
    }
    if ((aC = z >> 1) != 0) {
      z = aC;
      aD += 1
    }
    return aD
  }
  function w() {
    if (this.t <= 0) {
      return 0
    }
    return this.DB * (this.t - 1) + l(this[this.t - 1] ^ (this.s & this.DM))
  }
  function at(aC, z) {
    var t;
    for (t = this.t - 1; t >= 0; --t) {
      z[t + aC] = this[t]
    }
    for (t = aC - 1; t >= 0; --t) {
      z[t] = 0
    }
    z.t = this.t + aC;
    z.s = this.s
  }
  function Z(aC, z) {
    for (var t = aC; t < this.t; ++t) {
      z[t - aC] = this[t]
    }
    z.t = Math.max(this.t - aC, 0);
    z.s = this.s
  }
  function v(aH, aD) {
    var z = aH % this.DB;
    var t = this.DB - z;
    var aF = (1 << t) - 1;
    var aE = Math.floor(aH / this.DB), aG = (this.s << z) & this.DM, aC;
    for (aC = this.t - 1; aC >= 0; --aC) {
      aD[aC + aE + 1] = (this[aC] >> t) | aG;
      aG = (this[aC] & aF) << z
    }
    for (aC = aE - 1; aC >= 0; --aC) {
      aD[aC] = 0
    }
    aD[aE] = aG;
    aD.t = this.t + aE + 1;
    aD.s = this.s;
    aD.clamp()
  }
  function n(aG, aD) {
    aD.s = this.s;
    var aE = Math.floor(aG / this.DB);
    if (aE >= this.t) {
      aD.t = 0;
      return
    }
    var z = aG % this.DB;
    var t = this.DB - z;
    var aF = (1 << z) - 1;
    aD[0] = this[aE] >> z;
    for (var aC = aE + 1; aC < this.t; ++aC) {
      aD[aC - aE - 1] |= (this[aC] & aF) << t;
      aD[aC - aE] = this[aC] >> z
    }
    if (z > 0) {
      aD[this.t - aE - 1] |= (this.s & aF) << t
    }
    aD.t = this.t - aE;
    aD.clamp()
  }
  function ad(z, aD) {
    var aC = 0, aE = 0, t = Math.min(z.t, this.t);
    while (aC < t) {
      aE += this[aC] - z[aC];
      aD[aC++] = aE & this.DM;
      aE >>= this.DB
    }
    if (z.t < this.t) {
      aE -= z.s;
      while (aC < this.t) {
        aE += this[aC];
        aD[aC++] = aE & this.DM;
        aE >>= this.DB
      }
      aE += this.s
    } else {
      aE += this.s;
      while (aC < z.t) {
        aE -= z[aC];
        aD[aC++] = aE & this.DM;
        aE >>= this.DB
      }
      aE -= z.s
    }
    aD.s = (aE < 0) ? -1 : 0;
    if (aE < -1) {
      aD[aC++] = this.DV + aE
    } else {
      if (aE > 0) {
        aD[aC++] = aE
      }
    }
    aD.t = aC;
    aD.clamp()
  }
  function F(z, aD) {
    var t = this.abs(), aE = z.abs();
    var aC = t.t;
    aD.t = aC + aE.t;
    while (--aC >= 0) {
      aD[aC] = 0
    }
    for (aC = 0; aC < aE.t; ++aC) {
      aD[aC + t.t] = t.am(0, aE[aC], aD, aC, 0, t.t)
    }
    aD.s = 0;
    aD.clamp();
    if (this.s != z.s) {
      au.ZERO.subTo(aD, aD)
    }
  }
  function S(aC) {
    var t = this.abs();
    var z = aC.t = 2 * t.t;
    while (--z >= 0) {
      aC[z] = 0
    }
    for (z = 0; z < t.t - 1; ++z) {
      var aD = t.am(z, t[z], aC, 2 * z, 0, 1);
      if ((aC[z + t.t] += t.am(z + 1, 2 * t[z], aC, 2 * z + 1, aD, t.t - z - 1)) >= t.DV) {
        aC[z + t.t] -= t.DV;
        aC[z + t.t + 1] = 1
      }
    }
    if (aC.t > 0) {
      aC[aC.t - 1] += t.am(z, t[z], aC, 2 * z, 0, 1)
    }
    aC.s = 0;
    aC.clamp()
  }
  function G(aK, aH, aG) {
    var aQ = aK.abs();
    if (aQ.t <= 0) {
      return
    }
    var aI = this.abs();
    if (aI.t < aQ.t) {
      if (aH != null) {
        aH.fromInt(0)
      }
      if (aG != null) {
        this.copyTo(aG)
      }
      return
    }
    if (aG == null) {
      aG = j()
    }
    var aE = j(), z = this.s, aJ = aK.s;
    var aP = this.DB - l(aQ[aQ.t - 1]);
    if (aP > 0) {
      aQ.lShiftTo(aP, aE);
      aI.lShiftTo(aP, aG)
    } else {
      aQ.copyTo(aE);
      aI.copyTo(aG)
    }
    var aM = aE.t;
    var aC = aE[aM - 1];
    if (aC == 0) {
      return
    }
    var aL = aC * (1 << this.F1) + ((aM > 1) ? aE[aM - 2] >> this.F2 : 0);
    var aT = this.FV / aL, aS = (1 << this.F1) / aL, aR = 1 << this.F2;
    var aO = aG.t, aN = aO - aM, aF = (aH == null) ? j() : aH;
    aE.dlShiftTo(aN, aF);
    if (aG.compareTo(aF) >= 0) {
      aG[aG.t++] = 1;
      aG.subTo(aF, aG)
    }
    au.ONE.dlShiftTo(aM, aF);
    aF.subTo(aE, aE);
    while (aE.t < aM) {
      aE[aE.t++] = 0
    }
    while (--aN >= 0) {
      var aD = (aG[--aO] == aC) ? this.DM : Math.floor(aG[aO] * aT + (aG[aO - 1] + aR) * aS);
      if ((aG[aO] += aE.am(0, aD, aG, aN, 0, aM)) < aD) {
        aE.dlShiftTo(aN, aF);
        aG.subTo(aF, aG);
        while (aG[aO] < --aD) {
          aG.subTo(aF, aG)
        }
      }
    }
    if (aH != null) {
      aG.drShiftTo(aM, aH);
      if (z != aJ) {
        au.ZERO.subTo(aH, aH)
      }
    }
    aG.t = aM;
    aG.clamp();
    if (aP > 0) {
      aG.rShiftTo(aP, aG)
    }
    if (z < 0) {
      au.ZERO.subTo(aG, aG)
    }
  }
  function P(t) {
    var z = j();
    this.abs().divRemTo(t, null, z);
    if (this.s < 0 && z.compareTo(au.ZERO) > 0) {
      t.subTo(z, z)
    }
    return z
  }
  function M(t) {
    this.m = t
  }
  function X(t) {
    if (t.s < 0 || t.compareTo(this.m) >= 0) {
      return t.mod(this.m)
    } else {
      return t
    }
  }
  function am(t) {
    return t
  }
  function L(t) {
    t.divRemTo(this.m, null, t)
  }
  function J(t, aC, z) {
    t.multiplyTo(aC, z);
    this.reduce(z)
  }
  function aw(t, z) {
    t.squareTo(z);
    this.reduce(z)
  }
  M.prototype.convert = X;
  M.prototype.revert = am;
  M.prototype.reduce = L;
  M.prototype.mulTo = J;
  M.prototype.sqrTo = aw;
  function D() {
    if (this.t < 1) {
      return 0
    }
    var t = this[0];
    if ((t & 1) == 0) {
      return 0
    }
    var z = t & 3;
    z = (z * (2 - (t & 15) * z)) & 15;
    z = (z * (2 - (t & 255) * z)) & 255;
    z = (z * (2 - (((t & 65535) * z) & 65535))) & 65535;
    z = (z * (2 - t * z % this.DV)) % this.DV;
    return (z > 0) ? this.DV - z : -z
  }
  function g(t) {
    this.m = t;
    this.mp = t.invDigit();
    this.mpl = this.mp & 32767;
    this.mph = this.mp >> 15;
    this.um = (1 << (t.DB - 15)) - 1;
    this.mt2 = 2 * t.t
  }
  function al(t) {
    var z = j();
    t.abs().dlShiftTo(this.m.t, z);
    z.divRemTo(this.m, null, z);
    if (t.s < 0 && z.compareTo(au.ZERO) > 0) {
      this.m.subTo(z, z)
    }
    return z
  }
  function av(t) {
    var z = j();
    t.copyTo(z);
    this.reduce(z);
    return z
  }
  function R(t) {
    while (t.t <= this.mt2) {
      t[t.t++] = 0
    }
    for (var aC = 0; aC < this.m.t; ++aC) {
      var z = t[aC] & 32767;
      var aD = (z * this.mpl + (((z * this.mph + (t[aC] >> 15) * this.mpl) & this.um) << 15)) & t.DM;
      z = aC + this.m.t;
      t[z] += this.m.am(0, aD, t, aC, 0, this.m.t);
      while (t[z] >= t.DV) {
        t[z] -= t.DV;
        t[++z]++
      }
    }
    t.clamp();
    t.drShiftTo(this.m.t, t);
    if (t.compareTo(this.m) >= 0) {
      t.subTo(this.m, t)
    }
  }
  function ao(t, z) {
    t.squareTo(z);
    this.reduce(z)
  }
  function B(t, aC, z) {
    t.multiplyTo(aC, z);
    this.reduce(z)
  }
  g.prototype.convert = al;
  g.prototype.revert = av;
  g.prototype.reduce = R;
  g.prototype.mulTo = B;
  g.prototype.sqrTo = ao;
  function k() {
    return ((this.t > 0) ? (this[0] & 1) : this.s) == 0
  }
  function A(aH, aI) {
    if (aH > 4294967295 || aH < 1) {
      return au.ONE
    }
    var aG = j(), aC = j(), aF = aI.convert(this), aE = l(aH) - 1;
    aF.copyTo(aG);
    while (--aE >= 0) {
      aI.sqrTo(aG, aC);
      if ((aH & (1 << aE)) > 0) {
        aI.mulTo(aC, aF, aG)
      } else {
        var aD = aG;
        aG = aC;
        aC = aD
      }
    }
    return aI.revert(aG)
  }
  function ap(aC, t) {
    var aD;
    if (aC < 256 || t.isEven()) {
      aD = new M(t)
    } else {
      aD = new g(t)
    }
    return this.exp(aC, aD)
  }
  au.prototype.copyTo = aa;
  au.prototype.fromInt = p;
  au.prototype.fromString = y;
  au.prototype.clamp = Q;
  au.prototype.dlShiftTo = at;
  au.prototype.drShiftTo = Z;
  au.prototype.lShiftTo = v;
  au.prototype.rShiftTo = n;
  au.prototype.subTo = ad;
  au.prototype.multiplyTo = F;
  au.prototype.squareTo = S;
  au.prototype.divRemTo = G;
  au.prototype.invDigit = D;
  au.prototype.isEven = k;
  au.prototype.exp = A;
  au.prototype.toString = s;
  au.prototype.negate = T;
  au.prototype.abs = an;
  au.prototype.compareTo = I;
  au.prototype.bitLength = w;
  au.prototype.mod = P;
  au.prototype.modPowInt = ap;
  au.ZERO = c(0);
  au.ONE = c(1);
  var o;
  var W;
  var ae;
  function d(t) {
    W[ae++] ^= t & 255;
    W[ae++] ^= (t >> 8) & 255;
    W[ae++] ^= (t >> 16) & 255;
    W[ae++] ^= (t >> 24) & 255;
    if (ae >= O) {
      ae -= O
    }
  }
  function V() {
    d(new Date().getTime())
  }
  if (W == null) {
    W = new Array();
    ae = 0;
    var K;
    if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto && window.crypto.random) {
      var H = window.crypto.random(32);
      for (K = 0; K < H.length; ++K) {
        W[ae++] = H.charCodeAt(K) & 255
      }
    }
    while (ae < O) {
      K = Math.floor(65536 * Math.random());
      W[ae++] = K >>> 8;
      W[ae++] = K & 255
    }
    ae = 0;
    V()
  }
  function E() {
    if (o == null) {
      V();
      o = aq();
      o.init(W);
      for (ae = 0; ae < W.length; ++ae) {
        W[ae] = 0
      }
      ae = 0
    }
    return o.next()
  }
  function ax(z) {
    var t;
    for (t = 0; t < z.length; ++t) {
      z[t] = E()
    }
  }
  function af() {
  }
  af.prototype.nextBytes = ax;
  function m() {
    this.i = 0;
    this.j = 0;
    this.S = new Array()
  }
  function f(aE) {
    var aD, z, aC;
    for (aD = 0; aD < 256; ++aD) {
      this.S[aD] = aD
    }
    z = 0;
    for (aD = 0; aD < 256; ++aD) {
      z = (z + this.S[aD] + aE[aD % aE.length]) & 255;
      aC = this.S[aD];
      this.S[aD] = this.S[z];
      this.S[z] = aC
    }
    this.i = 0;
    this.j = 0
  }
  function a() {
    var z;
    this.i = (this.i + 1) & 255;
    this.j = (this.j + this.S[this.i]) & 255;
    z = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = z;
    return this.S[(z + this.S[this.i]) & 255]
  }
  m.prototype.init = f;
  m.prototype.next = a;
  function aq() {
    return new m()
  }
  var O = 256;
  function U(aD, aC, z) {
    aC = "DF29C573C20C0B3D46F7C214B6ADB6DF55326ABFD6B4C182462446A2F6C103B80568B50019F0998D4680B0ADCA51FF916DBA64ED1004FCAE5B05A1D2EA8E986A6E0E4A153D4E0F231D9672407DC859AF8C403B938077AA736E115C2D5D7282FBC2D15CA6CE2EBE2B20EA44B45BCDA05B37D0A41EE590C0F17936E02235B8DB31";
    z = "3";
    var t = new N();
    t.setPublic(aC, z);
    return t.encrypt(aD)
  }
  return {rsa_encrypt: U}
}();
$.Encryption = function() {
  var hexcase = 1;
  var b64pad = "";
  var chrsz = 8;
  var mode = 32;
  function md5(s) {
    return hex_md5(s)
  }
  function hex_md5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz))
  }
  function str_md5(s) {
    return binl2str(core_md5(str2binl(s), s.length * chrsz))
  }
  function hex_hmac_md5(key, data) {
    return binl2hex(core_hmac_md5(key, data))
  }
  function b64_hmac_md5(key, data) {
    return binl2b64(core_hmac_md5(key, data))
  }
  function str_hmac_md5(key, data) {
    return binl2str(core_hmac_md5(key, data))
  }
  function core_md5(x, len) {
    x[len >> 5] |= 128 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
      d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd)
    }
    if (mode == 16) {
      return Array(b, c)
    } else {
      return Array(a, b, c, d)
    }
  }
  function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
  }
  function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
  }
  function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
  }
  function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
  }
  function core_hmac_md5(key, data) {
    var bkey = str2binl(key);
    if (bkey.length > 16) {
      bkey = core_md5(bkey, key.length * chrsz)
    }
    var ipad = Array(16), opad = Array(16);
    for (var i = 0; i < 16; i++) {
      ipad[i] = bkey[i] ^ 909522486;
      opad[i] = bkey[i] ^ 1549556828
    }
    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128)
  }
  function safe_add(x, y) {
    var lsw = (x & 65535) + (y & 65535);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 65535)
  }
  function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }
  function str2binl(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32)
    }
    return bin
  }
  function binl2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz) {
      str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask)
    }
    return str
  }
  function binl2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 15) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 15)
    }
    return str
  }
  function binl2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
      var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 255) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 255) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 255);
      for (var j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > binarray.length * 32) {
          str += b64pad
        } else {
          str += tab.charAt((triplet >> 6 * (3 - j)) & 63)
        }
      }
    }
    return str
  }
  function hexchar2bin(str) {
    var arr = [];
    for (var i = 0; i < str.length; i = i + 2) {
      arr.push("\\x" + str.substr(i, 2))
    }
    arr = arr.join("");
    eval("var temp = '" + arr + "'");
    return temp
  }
  function getEncryption(password, uin, vcode) {
    var str1 = hexchar2bin(md5(password));
    var str2 = md5(str1 + uin);
    var str3 = md5(str2 + vcode.toUpperCase());
    return str3
  }
  function getRSAEncryption(password, vcode) {
    var str1 = md5(password);
    var str2 = str1 + vcode.toUpperCase();
    var str3 = $.RSA.rsa_encrypt(str2);
    return str3
  }
  return {getEncryption: getEncryption,getRSAEncryption: getRSAEncryption}
}();
pt.setHeader = function(a) {
  for (var b in a) {
    if (b != "") {
      if ($("img_" + b)) {
        if (a[b] && a[b].indexOf("sys.getface.qq.com") > -1) {
          $("img_" + b).src = pt.plogin.dftImg
        } else {
          $("img_" + b).src = a[b] || pt.plogin.dftImg
        }
      } else {
        if (a[b] && a[b].indexOf("sys.getface.qq.com") > -1) {
          $("auth_face").src = pt.plogin.dftImg
        } else {
          $("auth_face").src = a[b] || pt.plogin.dftImg
        }
      }
    }
  }
};
pt.qlogin = function() {
  var I = {"19": 3,"20": 2,"21": 3,"22": 3,"23": 3,"25": 3,"32": 3,"33": 3,"34": 3};
  var r = {"19": 300,"20": 240,"21": 360,"22": 360,"23": 300,"25": 300,"32": 360,"33": 300,"34": 300};
  var A = [];
  var p = [];
  var B = 9;
  var O = '<a hidefocus=true draggable=false href="javascript:void(0);" tabindex="#tabindex#" uin="#uin#" type="#type#" onclick="pt.qlogin.imgClick(this);return false;" onfocus="pt.qlogin.imgFocus(this);" onblur="pt.qlogin.imgBlur(this);" onmouseover="pt.qlogin.imgMouseover(this);" onmousedown="pt.qlogin.imgMouseDowm(this)" onmouseup="pt.qlogin.imgMouseUp(this)" onmouseout="pt.qlogin.imgMouseUp(this)" class="face"  >          <img  id="img_#uin#" uin="#uin#" type="#type#" src="#src#"    onerror="pt.qlogin.imgErr(this);" />           <span id="mengban_#uin#"></span>          <span class="uin_menban"></span>          <span class="uin">#uin#</span>          <span id="img_out_#uin#" uin="#uin#" type="#type#"  class="img_out"  ></span>          <span id="nick_#uin#" class="#nick_class#">#nick#</span>          <span  class="#vip_logo#"></span>      </a>';
  var t = '<span  uin="#uin#" type="#type#"  class="#qr_class#"  >          <span class="qr_safe_tips">安全登录，防止盗号</span>          <img   id="qrlogin_img" uin="#uin#" type="#type#" src="#src#" class="qrImg"  />           <span id="nick_#uin#"  class="qr_app_name">            <a class="qr_short_tips"  href="http://im.qq.com/mobileqq/#from=login" target="_blank">#nick#</a>            <span class="qr_safe_login">安全登录</span>            <a hidefocus=true draggable=false class="qr_info_link"  href="http://im.qq.com/mobileqq/#from=login" target="_blank">使用QQ手机版扫描二维码</a>          </span>          <span  class="qrlogin_img_out"  onmouseover="pt.plogin.showQrTips();" onmouseout="pt.plogin.hideQrTips();"></span>          <span id="qr_invalid" class="qr_invalid" onclick="pt.plogin.begin_qrlogin();" onmouseover="pt.plogin.showQrTips();" onmouseout="pt.plogin.hideQrTips();">            <span id="qr_mengban" class="qr_mengban"></span>            <span id="qr_invalid_tips" class="qr_invalid_tips">二维码失效<br/>请点击刷新</span>          </span>       </span>';
  var F = false;
  var l = 1;
  var y = I[pt.ptui.style];
  var v = r[pt.ptui.style];
  var s = 1;
  var J = 5;
  var f = null;
  var H = true;
  var L = 0;
  var a = function(W) {
    if ((W == 1 && s <= 1) || (W == 2 && s >= l)) {
      return
    }
    var S = 0;
    var V = 1;
    var U = $("qlogin_show").offsetWidth || v;
    var P = 10;
    var T = Math.ceil(U / P);
    var R = 0;
    if (W == 1) {
      s--;
      if (s <= 1) {
        $.css.hide($("prePage"));
        $.css.show($("nextPage"))
      } else {
        $.css.show($("nextPage"));
        $.css.show($("prePage"))
      }
    } else {
      s++;
      if (s >= l) {
        $.css.hide($("nextPage"));
        $.css.show($("prePage"))
      } else {
        $.css.show($("nextPage"));
        $.css.show($("prePage"))
      }
    }
    function Q() {
      if (W == 1) {
        $("qlogin_list").style.left = (R * P - s * U) + "px"
      } else {
        $("qlogin_list").style.left = ((2 - s) * U - R * P) + "px"
      }
      R++;
      if (R > T) {
        window.clearInterval(S)
      }
    }
    S = window.setInterval(Q, V)
  };
  var K = function() {
    p.length = 0;
    if ($.suportActive()) {
      try {
        var au = $.activetxsso;
        var W = au.CreateTXSSOData();
        var aq = au.DoOperation(1, W);
        if (null == aq) {
          return
        }
        var al = aq.GetArray("PTALIST");
        var aw = al.GetSize();
        var ap = "";
        for (var ax = 0; ax < aw; ax++) {
          var U = al.GetData(ax);
          var at = U.GetDWord("dwSSO_Account_dwAccountUin");
          var af = U.GetDWord("dwSSO_Account_dwAccountUin");
          var Z = "";
          var ae = U.GetByte("cSSO_Account_cAccountType");
          var av = at;
          if (ae == 1) {
            try {
              Z = U.GetArray("SSO_Account_AccountValueList");
              av = Z.GetStr(0)
            } catch (ar) {
            }
          }
          var ai = 0;
          try {
            ai = U.GetWord("wSSO_Account_wFaceIndex")
          } catch (ar) {
            ai = 0
          }
          var ak = "";
          try {
            ak = U.GetStr("strSSO_Account_strNickName")
          } catch (ar) {
            ak = ""
          }
          var V = U.GetBuf("bufGTKey_PTLOGIN");
          var X = U.GetBuf("bufST_PTLOGIN");
          var ad = "";
          var P = X.GetSize();
          for (var ao = 0; ao < P; ao++) {
            var Q = X.GetAt(ao).toString("16");
            if (Q.length == 1) {
              Q = "0" + Q
            }
            ad += Q
          }
          var ah = U.GetDWord("dwSSO_Account_dwUinFlag");
          var ac = {uin: at,name: av,uinString: af,type: ae,face: ai,nick: ak,flag: ah,key: ad,loginType: 2};
          p.push(ac)
        }
      } catch (ar) {
        $.report.nlog("IE获取快速登录信息失败：" + ar.message, "391626")
      }
    } else {
      try {
        var R = $.nptxsso;
        var ab = R.InitPVA();
        if (ab != false) {
          var Y = R.GetPVACount();
          for (var ao = 0; ao < Y; ao++) {
            var S = R.GetUin(ao);
            var T = R.GetAccountName(ao);
            var af = R.GetUinString(ao);
            var aa = R.GetFaceIndex(ao);
            var am = R.GetNickname(ao);
            var ag = R.GetGender(ao);
            var an = R.GetUinFlag(ao);
            var ay = R.GetGTKey(ao);
            var aj = R.GetST(ao);
            var ac = {uin: S,name: T,uinString: af,type: 0,face: aa,nick: am,flag: an,key: aj,loginType: 2};
            p.push(ac)
          }
          if (typeof (R.GetKeyIndex) == "function") {
            B = R.GetKeyIndex()
          }
        }
      } catch (ar) {
        $.report.nlog("非IE获取快速登录信息失败：" + (ar.message || ar), "391627")
      }
    }
  };
  var m = function(R) {
    for (var Q = 0, P = p.length; Q < P; Q++) {
      var S = p[Q];
      if (S.uinString == R) {
        return S
      }
    }
    return null
  };
  var C = function() {
    K();
    var T = [];
    var R = p.length;
    if (pt.plogin.isNewQr) {
      var S = {};
      S.loginType = 3;
      T.push(S)
    }
    if (pt.plogin.authUin && pt.ptui.auth_mode == "0") {
      var S = {};
      S.name = pt.plogin.authUin;
      S.uinString = pt.plogin.authUin;
      S.nick = $.str.utf8ToUincode($.cookie.get("ptuserinfo")) || pt.plogin.authUin;
      S.loginType = 1;
      T.push(S)
    }
    for (var P = 0; P < R; P++) {
      var Q = p[P];
      if (pt.plogin.authUin && (pt.plogin.authUin == Q.name || pt.plogin.authUin == Q.uinString)) {
        continue
      } else {
        T.push(Q)
      }
      if (T.length == 5) {
        break
      }
    }
    A = T;
    return T
  };
  var M = function() {
    var aa = "";
    var ac = 0;
    var Z = C();
    var ad = $("qlogin_list");
    if (null == ad) {
      return
    }
    var W = Z.length > J ? J : Z.length;
    if (W == 0) {
      pt.plogin.switchpage(1, true);
      return
    }
    if (pt.plogin.isNewQr) {
      if (W == 1 && pt.plogin.isNewQr) {
        $("qlogin_tips") && $.css.hide($("qlogin_tips"));
        $("qlogin_show").style.top = "25px"
      } else {
        $("qlogin_tips") && $.css.show($("qlogin_tips"));
        $("qlogin_show").style.top = ""
      }
    }
    l = Math.ceil(W / y);
    if (l >= 2) {
      $.css.show($("nextPage"))
    }
    for (var U = 0; U < W; U++) {
      var V = Z[U];
      var S = $.str.encodeHtml(V.uinString + "");
      var Q = $.str.encodeHtml(V.nick);
      if ($.str.trim(V.nick) == "") {
        Q = S
      }
      var ab = V.flag;
      var Y = ((ab & 4) == 4);
      var P = pt.plogin.dftImg;
      if (V.loginType == 3) {
        var T = $("qr_area");
        if (W == 1) {
          if (T) {
            $("qr_area").className = "qr_0"
          }
          if (pt.ptui.lang == "1033") {
            $("qlogin_show").style.height = ($("qlogin_show").offsetHeight + 10) + "px"
          }
        } else {
          if (T) {
            $("qr_area").className = "qr_1"
          }
        }
      } else {
        aa += O.replace(/#uin#/g, S).replace(/#nick#/g, function() {
          return Q
        }).replace(/#nick_class#/, Y ? "nick red" : "nick").replace(/#vip_logo#/, Y ? "vip_logo" : "").replace(/#type#/g, V.loginType).replace(/#src#/g, P).replace(/#tabindex#/, U + 1).replace(/#class#/g, V.loginType == 1 ? "auth" : "hide")
      }
    }
    aa = ad.innerHTML + aa;
    ad.innerHTML = aa;
    var X = $("qlogin_show").offsetWidth || v;
    var R = (l == 1 ? X : X / y * W);
    ad.style.width = R + "px";
    if (pt.plogin.isNewQr) {
      ad.style.width = (R + 4) + "px"
    }
    F = true;
    N();
    E()
  };
  var u = function(Q) {
    if (Q) {
      K();
      var P = m(Q);
      if (P == null) {
        pt.plogin.show_err(pt.str.qlogin_expire);
        $.report.monitor(231544, 1);
        return
      } else {
        var R = h(P);
        if (H) {
          $.http.loadScript(R)
        } else {
          pt.plogin.redirect(pt.ptui.target, R)
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
  var n = function(S, R, T) {
    var P = "";
    var U = S.split("#");
    var Q = U[0].indexOf("?") > 0 ? "&" : "?";
    if (U[0].substr(U[0].length - 1, 1) == "?") {
      Q = ""
    }
    if (U[1]) {
      U[1] = "#" + U[1]
    } else {
      U[1] = ""
    }
    P = U[0] + Q + R + "=" + T + U[1];
    return P
  };
  var G = function(Q) {
    var P = pt.ptui.s_url;
    if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable && pt.plogin.isMailLogin()) {
      P = n(P, "ss", 1)
    }
    if (pt.plogin.isMailLogin() && Q) {
      P = n(P, "account", encodeURIComponent(Q))
    }
    return P
  };
  var h = function(P) {
    var Q = (pt.ptui.isHttps ? "https://ssl.ptlogin2." : "http://ptlogin2.") + pt.ptui.domain + "/" + (pt.ptui.jumpname || "jump") + "?";
    if (pt.ptui.regmaster == 2) {
      Q = "http://ptlogin2.function.qq.com/jump?regmaster=2&"
    } else {
      if (pt.ptui.regmaster == 3) {
        Q = "http://ptlogin2.crm2.qq.com/jump?regmaster=3&"
      }
    }
    Q += "clientuin=" + P.uin + "&clientkey=" + P.key + "&keyindex=" + B + "&pt_aid=" + pt.ptui.appid + (pt.ptui.daid ? "&daid=" + pt.ptui.daid : "") + "&u1=" + encodeURIComponent(G());
    if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable && !pt.plogin.isMailLogin()) {
      Q += "&low_login_enable=1&low_login_hour=" + pt.plogin.low_login_hour
    }
    if (pt.ptui.csimc != "0" && pt.ptui.csimc) {
      Q += "&csimc=" + pt.ptui.csimc + "&csnum=" + pt.ptui.csnum + "&authid=" + pt.ptui.authid
    }
    if (pt.ptui.pt_qzone_sig == "1") {
      Q += "&pt_qzone_sig=1"
    }
    if (pt.ptui.pt_light == "1") {
      Q += "&pt_light=1"
    }
    if (H) {
      Q += "&ptopt=1"
    }
    return Q
  };
  var x = function() {
    var P = o();
    pt.plogin.redirect(pt.ptui.target, P);
    if (pt.ptui.style == 20) {
      pt.plogin.showLoading(35)
    } else {
      pt.plogin.showLoading(10)
    }
  };
  var o = function() {
    var P = pt.plogin.authSubmitUrl;
    P += "&regmaster=" + pt.ptui.regmaster + "&aid=" + pt.ptui.appid + "&s_url=" + encodeURIComponent(G());
    if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable) {
      P += "&low_login_enable=1&low_login_hour=" + pt.plogin.low_login_hour
    }
    if (pt.ptui.pt_light == "1") {
      P += "&pt_light=1"
    }
    return P
  };
  var k = function(P) {
    P.onerror = null;
    if (P.src != pt.plogin.dftImg) {
      P.src = pt.plogin.dftImg
    }
    return false
  };
  var b = function(P) {
    var R = P.getAttribute("type");
    var Q = P.getAttribute("uin");
    switch (R) {
      case "1":
        x();
        break;
      case "2":
        u(Q);
        break
    }
  };
  var g = function(P) {
    if (!P) {
      return
    }
    var Q = P.getAttribute("uin");
    if (Q) {
      $("img_out_" + Q).className = "img_out_focus"
    }
  };
  var w = function(P) {
    if (!P) {
      return
    }
    var Q = P.getAttribute("uin");
    if (Q) {
      $("img_out_" + Q).className = "img_out"
    }
  };
  var D = function(P) {
    if (!P) {
      return
    }
    if (f != P) {
      w(f);
      f = P
    }
    g(P)
  };
  var d = function(P) {
    if (!P) {
      return
    }
    var Q = P.getAttribute("uin");
    var R = $("mengban_" + Q);
    R && (R.className = "face_mengban")
  };
  var q = function(P) {
    if (!P) {
      return
    }
    var Q = P.getAttribute("uin");
    var R = $("mengban_" + Q);
    R && (R.className = "")
  };
  var N = function() {
    var Q = $("qlogin_list");
    var P = Q.getElementsByTagName("a");
    if (P.length > 0) {
      f = P[0]
    }
  };
  var E = function() {
    try {
      f.focus()
    } catch (P) {
    }
  };
  var z = function() {
    var Q = $("prePage");
    var P = $("nextPage");
    if (Q) {
      $.e.add(Q, "click", function(R) {
        a(1)
      })
    }
    if (P) {
      $.e.add(P, "click", function(R) {
        a(2)
      })
    }
  };
  var c = function() {
    var Q = A.length;
    for (var P = 0; P < Q; P++) {
      if (A[P].uinString) {
        $.http.loadScript((pt.ptui.isHttps ? "https://ssl.ptlogin2." : "http://ptlogin2.") + pt.ptui.domain + "/getface?appid=" + pt.ptui.appid + "&imgtype=3&encrytype=0&devtype=0&keytpye=0&uin=" + A[P].uinString + "&r=" + Math.random())
      }
    }
  };
  var j = function() {
    z()
  };
  j();
  return {qloginInit: j,hasBuildQlogin: F,buildQloginList: M,imgClick: b,imgFocus: g,imgBlur: w,imgMouseover: D,imgMouseDowm: d,imgMouseUp: q,imgErr: k,focusHeader: E,initFace: c,authLoginSubmit: x,qloginClock: L,getSurl: G}
}();
function ptui_qlogin_CB(b, a, c) {
  window.clearTimeout(pt.qlogin.qloginClock);
  switch (b) {
    case "0":
      pt.plogin.redirect(pt.ptui.target, a);
      break;
    default:
      pt.plogin.switchpage(1);
      pt.plogin.show_err(c, true)
  }
}
pt.plogin = {accout: "",at_accout: "",uin: "",saltUin: "",hasCheck: false,lastCheckAccout: "",needVc: false,vcFlag: false,ckNum: {},action: [0, 0],passwordErrorNum: 1,isIpad: false,t_appid: 46000101,seller_id: 703010802,checkUrl: "",loginUrl: "",verifycodeUrl: "",newVerifycodeUrl: "",needShowNewVc: false,pt_verifysession: "",checkClock: 0,isCheckTimeout: false,checkTime: 0,submitTime: 0,errclock: 0,loginClock: 0,login_param: pt.ptui.href.substring(pt.ptui.href.indexOf("?") + 1),err_m: $("err_m"),low_login_enable: true,low_login_hour: 720,low_login_isshow: false,list_index: [-1, 2],keyCode: {UP: 38,DOWN: 40,LEFT: 37,RIGHT: 39,ENTER: 13,TAB: 9,BACK: 8,DEL: 46,F5: 116},knownEmail: (pt.ptui.style == 25 ? ["qq.com", "vip.qq.com", "foxmail.com"] : ["qq.com", "foxmail.com", "gmail.com", "hotmail.com", "yahoo.com", "sina.com", "163.com", "126.com", "vip.qq.com", "vip.sina.com", "sina.cn", "sohu.com", "yahoo.cn", "yahoo.com.cn", "139.com", "wo.com.cn", "189.cn", "live.com", "msn.com", "live.hk", "live.cn", "hotmail.com.cn", "hinet.net", "msa.hinet.net", "cm1.hinet.net", "umail.hinet.net", "xuite.net", "yam.com", "pchome.com.tw", "netvigator.com", "seed.net.tw", "anet.net.tw"]),qrlogin_clock: 0,qrlogin_timeout: 0,qrlogin_timeout_time: 100000,isQrLogin: false,qr_uin: "",qr_nick: "",dftImg: "",need_hide_operate_tips: true,js_type: 1,xuiState: 1,delayTime: 5000,delayMonitorId: "294059",hasSubmit: false,isdTime: {},authUin: "",authSubmitUrl: "",loginState: 1,RSAKey: false,aqScanLink: "<a href='javascript:void(0)'; onclick='pt.plogin.switch_qrlogin()'>" + (pt.ptui.lang == "2052" ? "立即扫描" : (pt.ptui.lang == "1028" ? "立即掃描" : "Scan now")) + "</a>",isNewQr: false,hasNoQlogin: false,checkRet: -1,cap_cd: 0,checkErr: {"2052": "网络繁忙，请稍后重试。","1028": "網絡繁忙，請稍後重試。","1033": "The network is busy, please try again later."},isTenpay: pt.ptui.style == 34,isMailLogin: function() {
  return pt.ptui.style == 25
},domFocus: function(b) {
  try {
    b.focus()
  } catch (a) {
  }
},formFocus: function() {
  var b = document.loginform;
  try {
    var a = b.u;
    var d = b.p;
    var f = b.verifycode;
    if (a.value == "") {
      a.focus();
      return
    }
    if (d.value == "") {
      d.focus();
      return
    }
    if (f.value == "") {
      f.focus()
    }
  } catch (c) {
  }
},getAuthUrl: function() {
  var b = (pt.ptui.isHttps ? "https://ssl." : "http://") + "ptlogin2." + pt.ptui.domain + "/pt4_auth?daid=" + pt.ptui.daid + "&appid=" + pt.ptui.appid + "&auth_token=" + $.str.time33($.cookie.get("supertoken"));
  var a = pt.ptui.s_url;
  if (/^https/.test(a)) {
    b += "&pt4_shttps=1"
  }
  if (pt.ptui.pt_qzone_sig == "1") {
    b += "&pt_qzone_sig=1"
  }
  return b
},auth: function() {
  pt.ptui.isHttps = $.check.isHttps();
  var a = pt.plogin.getAuthUrl();
  var b = $.cookie.get("superuin");
  if (pt.ptui.daid && pt.ptui.noAuth != "1" && b != "") {
    $.http.loadScript(a)
  } else {
    pt.plogin.init()
  }
},initAuthInfo: function(a) {
  var b = $.cookie.get("uin").replace(/^o0*/, "");
  var c = $.str.utf8ToUincode($.cookie.get("ptuserinfo")) || b;
  $("auth_uin").innerHTML = $.str.encodeHtml(b);
  $("auth_nick").innerHTML = $.str.encodeHtml(c);
  $("auth_area").setAttribute("authUrl", $.str.encodeHtml(a));
  $.http.loadScript((pt.ptui.isHttps ? "https://ssl.ptlogin2." : "http://ptlogin2.") + pt.ptui.domain + "/getface?appid=" + pt.ptui.appid + "&imgtype=3&encrytype=0&devtype=0&keytpye=0&uin=" + b + "&r=" + Math.random())
},showAuth: function(c, b) {
  if (c == 2) {
    $.css.hide($("cancleAuthOuter"))
  }
  pt.plogin.initAuthInfo(b);
  var a = pt.ptui.style;
  if (a == 22 || a == 23) {
    $.css.hide($("header"));
    $.css.hide($("authHeader"))
  }
  $("authLogin").style.height = $("login").offsetHeight - (a == 11 ? 2 : 4) + "px";
  $.css.show($("authLogin"));
  pt.plogin.ptui_notifySize("login")
},cancleAuth: function() {
  var a = pt.ptui.style;
  if (a == 22 || a == 23) {
    $.css.show($("header"));
    $.css.show($("authHeader"))
  }
  $.css.hide($("authLogin"));
  pt.plogin.ptui_notifySize("login")
},authLogin: function() {
  pt.qlogin.authLoginSubmit()
},authMouseDowm: function(a) {
  var b = $("auth_mengban");
  b && (b.className = "face_mengban")
},authMouseUp: function(a) {
  var b = $("auth_mengban");
  b && (b.className = "")
},onQloginSwitch: function(a) {
  a.preventDefault();
  pt.plogin.switchpage(2);
  $.report.monitor("331284", 0.05)
},initQlogin: function(c) {
  var d = 0;
  var a = false;
  if (c && pt.ptui.auth_mode == 0) {
    a = true
  }
  if (pt.ptui.enable_qlogin != 0 && $.cookie.get("pt_qlogincode") != 5) {
    d = $.getLoginQQNum()
  }
  d += a ? 1 : 0;
  if (d == 0) {
    pt.plogin.hasNoQlogin = true
  }
  if (d > 0 || pt.plogin.isNewQr) {
    $("login").className = "login";
    $("switcher_plogin").innerHTML = pt.str.h_pt_login;
    if (pt.ptui.style == 34) {
      $("switcher_plogin").innerHTML = pt.str.otherqq_login
    }
    if (pt.plogin.isMailLogin() && d == 0) {
      pt.plogin.switchpage(1)
    } else {
      pt.plogin.switchpage(2, true)
    }
    if (!pt.qlogin.hasBuildQlogin) {
      pt.qlogin.buildQloginList()
    }
  } else {
    pt.plogin.switchpage(1, true);
    $("login").className = "login_no_qlogin";
    $("switcher_plogin").innerHTML = pt.str.other_login;
    if (pt.plogin.isTenpay) {
      $("switcher_plogin").innerHTML = pt.str.otherqq_login
    }
    if ($("u").value && pt.ptui.auth_mode == 0) {
      pt.plogin.check()
    }
  }
  var b = pt.plogin.isTenpay && pt.ptui.defaultUin;
  if (b) {
    $.e.remove($("switcher_qlogin"), "click", pt.plogin.onQloginSwitch);
    pt.plogin.switchpage(1, true)
  }
  if (pt.ptui.auth_mode != 0 && c) {
    pt.plogin.showAuth(pt.ptui.auth_mode, c)
  }
},switchpage: function(a, d) {
  var f, c;
  pt.plogin.loginState = a;
  pt.plogin.hide_err();
  switch (a) {
    case 1:
      if (d) {
      }
      $.css.hide($("bottom_qlogin"));
      $.css.hide($("qlogin"));
      $.css.show($("web_qr_login"));
      $("qrswitch") && $.css.show($("qrswitch"));
      $("switcher_plogin").className = "switch_btn_focus";
      $("switcher_qlogin").className = "switch_btn";
      c = $("switcher_plogin").offsetWidth;
      f = $("switcher_plogin").parentNode.offsetWidth - c;
      if ($.browser("type") != "ff") {
        pt.plogin.formFocus()
      }
      if (pt.plogin.isNewQr) {
        pt.plogin.set_qrlogin_invalid()
      }
      if (pt.plogin.isTenpay && pt.ptui.defaultUin) {
        $("u").readOnly = true;
        var h = $("uinArea");
        var b = h.className;
        if (b.indexOf("default") < 0) {
          b += " default"
        }
        h.className = b;
        var g = $("uin_del");
        g && g.parentNode.removeChild(g);
        $("switcher_qlogin").className = "switch_btn_disabled";
        $("p").focus()
      }
      break;
    case 2:
      $.css.hide($("web_qr_login"));
      $.css.show($("qlogin"));
      $("switcher_plogin").className = "switch_btn";
      $("switcher_qlogin").className = "switch_btn_focus";
      $("qrswitch") && $.css.hide($("qrswitch"));
      $.css.show($("bottom_qlogin"));
      pt.qlogin.focusHeader();
      f = 0;
      c = $("switcher_qlogin").offsetWidth;
      if (pt.plogin.isNewQr && !d) {
        pt.plogin.begin_qrlogin()
      }
      break
  }
  window.setTimeout(function() {
    try {
      $.animate.animate("switch_bottom", {left: f,width: c}, 80, 20)
    } catch (j) {
      $("switch_bottom").style.left = f + "px";
      $("switch_bottom").style.width = c + "px"
    }
  }, 100);
  pt.plogin.ptui_notifySize("login")
},detectCapsLock: function(c) {
  var b = c.keyCode || c.which;
  var a = c.shiftKey || (b == 16) || false;
  if (((b >= 65 && b <= 90) && !a) || ((b >= 97 && b <= 122) && a)) {
    return true
  } else {
    return false
  }
},generateEmailTips: function(f) {
  var k = f.indexOf("@");
  var h = "";
  if (k == -1) {
    h = f
  } else {
    h = f.substring(0, k)
  }
  var b = [];
  for (var d = 0, a = pt.plogin.knownEmail.length; d < a; d++) {
    b.push(h + "@" + pt.plogin.knownEmail[d])
  }
  var g = [];
  for (var c = 0, a = b.length; c < a; c++) {
    if (b[c].indexOf(f) > -1) {
      g.push($.str.encodeHtml(b[c]))
    }
  }
  if (pt.ptui.style == 19) {
    g = []
  }
  return g
},createEmailTips: function(f) {
  var a = pt.plogin.generateEmailTips(f);
  var h = a.length;
  var g = [];
  var d = "";
  var c = 4;
  h = Math.min(h, c);
  if (h == 0) {
    pt.plogin.list_index[0] = -1;
    pt.plogin.hideEmailTips();
    return
  }
  for (var b = 0; b < h; b++) {
    if (f == a[b]) {
      pt.plogin.hideEmailTips();
      return
    }
    d = "emailTips_" + b;
    if (0 == b) {
      g.push("<li id=" + d + " class='hover' >" + a[b] + "</li>")
    } else {
      g.push("<li id=" + d + ">" + a[b] + "</li>")
    }
  }
  $("email_list").innerHTML = g.join(" ");
  pt.plogin.list_index[0] = 0
},showEmailTips: function() {
  $.css.show($("email_list"))
},hideEmailTips: function() {
  $.css.hide($("email_list"))
},setUrl: function() {
  var a = pt.ptui.domain;
  var b = $.check.isHttps() && $.check.isSsl();
  pt.plogin.checkUrl = (pt.ptui.isHttps ? "https://ssl." : "http://check.") + "ptlogin2." + a + "/check";
  pt.plogin.loginUrl = (pt.ptui.isHttps ? "https://ssl." : "http://") + "ptlogin2." + a + "/";
  pt.plogin.verifycodeUrl = (pt.ptui.isHttps ? "https://ssl." : "http://") + "captcha." + a + "/getimage";
  pt.plogin.newVerifycodeUrl = (pt.ptui.isHttps ? "https://ssl." : "http://") + "captcha.qq.com/cap_union_show?clientype=2";
  if (b && a != "qq.com" && a != "tenpay.com") {
    pt.plogin.verifycodeUrl = "https://ssl.ptlogin2." + a + "/ptgetimage"
  }
  if (pt.ptui.regmaster == 2) {
    pt.plogin.checkUrl = "http://check.ptlogin2.function.qq.com/check?regmaster=2&";
    pt.plogin.loginUrl = "http://ptlogin2.function.qq.com/"
  } else {
    if (pt.ptui.regmaster == 3) {
      pt.plogin.checkUrl = (pt.ptui.isHttps ? "https://ssl." : "http://") + "check.ptlogin2.crm2.qq.com/check?regmaster=3&";
      pt.plogin.loginUrl = (pt.ptui.isHttps ? "https://ssl." : "http://") + "ptlogin2.crm2.qq.com/"
    }
  }
  pt.plogin.dftImg = pt.ptui.isHttps ? "https://ui.ptlogin2.qq.com/style/0/images/1.gif" : "http://imgcache.qq.com/ptlogin/v4/style/0/images/1.gif"
},init: function(a) {
  pt.plogin.setLowloginCheckbox();
  pt.plogin.isNewQr = (pt.ptui.style == 25 || pt.ptui.style == 32 || pt.ptui.style == 33 || pt.plogin.isTenpay) ? true : false;
  pt.ptui.isHttps = $.check.isHttps();
  pt.plogin.setUrl();
  pt.plogin.bindEvent();
  $("login_button") && ($("login_button").disabled = false);
  pt.plogin.set_default_uin(pt.ptui.defaultUin);
  if ($.check.is_weibo_appid(pt.ptui.appid)) {
    $("u") && ($("u").style.imeMode = "auto")
  }
  if (pt.ptui.isHttps) {
    pt.plogin.delayTime = 7000;
    pt.plogin.delayMonitorId = "294060"
  }
  pt.plogin.hideVipLink();
  pt.plogin.initQlogin(a);
  window.setTimeout(function() {
    pt.plogin.domLoad()
  }, 1000)
},aq_patch: function() {
  if (Math.random() < 0.05 && !pt.ptui.isHttps) {
    $.http.loadScript("http://mat1.gtimg.com/www/js/common_v2.js", function() {
      if (typeof checkNonTxDomain == "function") {
        try {
          checkNonTxDomain(1, 5)
        } catch (a) {
        }
      }
    })
  }
},hideVipLink: function() {
  var b = $("vip_link2");
  var a = $("vip_dot");
  if ((b && a) && (!$.check.needVip(pt.ptui.appid) || pt.ptui.lang != "2052")) {
    $.css.addClass(b, "hide");
    $.css.addClass(a, "hide")
  }
},set_default_uin: function(a) {
  if (a) {
  } else {
    a = unescape($.cookie.getOrigin("ptui_loginuin"));
    if (pt.ptui.appid != pt.plogin.t_appid && ($.check.isNick(a) || $.check.isName(a))) {
      a = $.cookie.get("pt2gguin").replace(/^o/, "") - 0;
      a = a == 0 ? "" : a
    }
  }
  $("u").value = a;
  if (a) {
    $.css.hide($("uin_tips"));
    $("uin_del") && $.css.show($("uin_del"));
    pt.plogin.set_accout()
  }
},set_accout: function() {
  var a = $.str.trim($("u").value);
  var b = pt.ptui.appid;
  pt.plogin.accout = a;
  pt.plogin.at_accout = a;
  if ($.check.isQiyeQQ800(a)) {
    pt.plogin.at_accout = "@" + a;
    return true
  }
  if ($.check.is_weibo_appid(b)) {
    if ($.check.isQQ(a) || $.check.isMail(a)) {
      return true
    } else {
      if ($.check.isNick(a) || $.check.isName(a)) {
        pt.plogin.at_accout = "@" + a;
        return true
      } else {
        if ($.check.isPhone(a)) {
          pt.plogin.at_accout = "@" + a.replace(/^(86|886)/, "");
          return true
        } else {
          if ($.check.isSeaPhone(a)) {
            pt.plogin.at_accout = "@00" + a.replace(/^(00)/, "");
            if (/^(@0088609)/.test(pt.plogin.at_accout)) {
              pt.plogin.at_accout = pt.plogin.at_accout.replace(/^(@0088609)/, "@008869")
            }
            return true
          }
        }
      }
    }
  } else {
    if ($.check.isQQ(a) || $.check.isMail(a)) {
      return true
    }
    if ($.check.isPhone(a)) {
      pt.plogin.at_accout = "@" + a.replace(/^(86|886)/, "");
      return true
    }
    if ($.check.isNick(a)) {
      $("u").value = a + "@qq.com";
      pt.plogin.accout = a + "@qq.com";
      pt.plogin.at_accout = a + "@qq.com";
      return true
    }
  }
  if ($.check.isForeignPhone(a)) {
    pt.plogin.at_accout = "@" + a
  }
  return true
},show_err: function(b, a) {
  pt.plogin.hideLoading();
  $.css.show($("error_tips"));
  pt.plogin.err_m.innerHTML = b;
  clearTimeout(pt.plogin.errclock);
  if (!a) {
    pt.plogin.errclock = setTimeout("pt.plogin.hide_err()", 5000)
  }
},hide_err: function() {
  $.css.hide($("error_tips"));
  pt.plogin.err_m.innerHTML = ""
},showAssistant: function(a) {
  if (pt.ptui.lang != "2052") {
    return
  }
  pt.plogin.hideLoading();
  $.css.show($("error_tips"));
  switch (a) {
    case 0:
      pt.plogin.err_m.innerHTML = "快速登录异常，试试<a class='tips_link' style='color: #29B1F1' href='/assistant/troubleshooter.html' target='_blank'>登录助手</a>修复";
      $.report.monitor("315785");
      break;
    case 1:
      pt.plogin.err_m.innerHTML = "快速登录异常，试试<a class='tips_link' style='color: #29B1F1' href='/assistant/troubleshooter.html' target='_blank'>登录助手</a>修复";
      $.report.monitor("315786");
      break;
    case 2:
      pt.plogin.err_m.innerHTML = "登录异常，试试<a class='tips_link' style='color: #29B1F1' href='/assistant/troubleshooter.html' target='_blank'>登录助手</a>修复";
      $.report.monitor("315787");
      break;
    case 3:
      pt.plogin.err_m.innerHTML = "快速登录异常，试试<a class='tips_link' style='color: #29B1F1' href='http://im.qq.com/qq/2013/' target='_blank' onclick='$.report.monitor(326049);'>升级QQ</a>修复";
      $.report.monitor("326046");
      break
  }
},showGuanjiaTips: function() {
  $.initGuanjiaPlugin();
  if ($.guanjiaPlugin) {
    $.guanjiaPlugin.QMStartUp(16, '/traytip=3 /tipProblemid=1401 /tipSource=18 /tipType=0 /tipIdParam=0 /tipIconUrl="http://dldir2.qq.com/invc/xfspeed/qqpcmgr/clinic/image/tipsicon_qq.png" /tipTitle="QQ快速登录异常?" /tipDesc="不能用已登录的QQ号快速登录，只能手动输入账号密码，建议用电脑诊所一键修复。"');
    $.report.monitor("316548")
  } else {
    $.report.monitor("316549")
  }
},showLoading: function(a) {
  pt.plogin.hide_err();
  $("loading_tips").style.top = a + "px";
  $.css.show($("loading_tips"))
},hideLoading: function() {
  $.css.hide($("loading_tips"))
},showLowList: function() {
  var a = $("combox_list");
  if (a) {
    $.css.show(a);
    pt.plogin.low_login_isshow = true
  }
},hideLowList: function() {
  var a = $("combox_list");
  if (a) {
    $.css.hide(a);
    pt.plogin.low_login_isshow = false
  }
},u_focus: function() {
  if ($("u").value == "") {
    $.css.show($("uin_tips"));
    $("uin_tips").className = "input_tips_focus"
  }
  $("u").parentNode.className = "inputOuter_focus"
},u_blur: function() {
  if ($("u").value == "") {
    $.css.show($("uin_tips"));
    $("uin_tips").className = "input_tips"
  } else {
    pt.plogin.set_accout();
    pt.plogin.check()
  }
  $("u").parentNode.className = "inputOuter"
},u_mouseover: function() {
  var a = $("u").parentNode;
  if (a.className == "inputOuter_focus") {
  } else {
    $("u").parentNode.className = "inputOuter_hover"
  }
},u_mouseout: function() {
  var a = $("u").parentNode;
  if (a.className == "inputOuter_focus") {
  } else {
    $("u").parentNode.className = "inputOuter"
  }
},window_blur: function() {
  pt.plogin.lastCheckAccout = ""
},u_change: function() {
  pt.plogin.set_accout();
  pt.plogin.passwordErrorNum = 1;
  pt.plogin.hasCheck = false;
  pt.plogin.hasSubmit = false
},list_keydown: function(j, g) {
  var f = $("email_list");
  var d = $("u");
  if (g == 1) {
    var f = $("combox_list")
  }
  var h = f.getElementsByTagName("li");
  var b = h.length;
  var a = j.keyCode;
  switch (a) {
    case pt.plogin.keyCode.UP:
      h[pt.plogin.list_index[g]].className = "";
      pt.plogin.list_index[g] = (pt.plogin.list_index[g] - 1 + b) % b;
      h[pt.plogin.list_index[g]].className = "hover";
      break;
    case pt.plogin.keyCode.DOWN:
      h[pt.plogin.list_index[g]].className = "";
      pt.plogin.list_index[g] = (pt.plogin.list_index[g] + 1) % b;
      h[pt.plogin.list_index[g]].className = "hover";
      break;
    case pt.plogin.keyCode.ENTER:
      var c = h[pt.plogin.list_index[g]].innerHTML;
      if (g == 0) {
        $("u").value = $.str.decodeHtml(c)
      }
      pt.plogin.hideEmailTips();
      pt.plogin.hideLowList();
      j.preventDefault();
      break;
    case pt.plogin.keyCode.TAB:
      pt.plogin.hideEmailTips();
      pt.plogin.hideLowList();
      break;
    default:
      break
  }
  if (g == 1) {
    $("combox_box").innerHTML = h[pt.plogin.list_index[g]].innerHTML;
    $("low_login_hour").value = h[pt.plogin.list_index[g]].getAttribute("value")
  }
},u_keydown: function(a) {
  $.css.hide($("uin_tips"));
  if (pt.plogin.list_index[0] == -1) {
    return
  }
  pt.plogin.list_keydown(a, 0)
},u_keyup: function(b) {
  var c = this.value;
  if (c == "") {
    $.css.show($("uin_tips"));
    $("uin_tips").className = "input_tips_focus";
    $("uin_del") && $.css.hide($("uin_del"))
  } else {
    $("uin_del") && $.css.show($("uin_del"))
  }
  var a = b.keyCode;
  if (a != pt.plogin.keyCode.UP && a != pt.plogin.keyCode.DOWN && a != pt.plogin.keyCode.ENTER && a != pt.plogin.keyCode.TAB && a != pt.plogin.keyCode.F5) {
    if ($("u").value.indexOf("@") > -1) {
      pt.plogin.showEmailTips();
      pt.plogin.createEmailTips($("u").value)
    } else {
      pt.plogin.hideEmailTips()
    }
  }
},email_mousemove: function(c) {
  var b = c.target;
  if (b.tagName.toLowerCase() != "li") {
    return
  }
  var a = $("emailTips_" + pt.plogin.list_index[0]);
  if (a) {
    a.className = ""
  }
  b.className = "hover";
  pt.plogin.list_index[0] = parseInt(b.getAttribute("id").substring(10));
  c.stopPropagation()
},email_click: function(c) {
  var b = c.target;
  if (b.tagName.toLowerCase() != "li") {
    return
  }
  var a = $("emailTips_" + pt.plogin.list_index[0]);
  if (a) {
    $("u").value = $.str.decodeHtml(a.innerHTML);
    pt.plogin.set_accout();
    pt.plogin.check()
  }
  pt.plogin.hideEmailTips();
  c.stopPropagation()
},p_focus: function() {
  if (this.value == "") {
    $.css.show($("pwd_tips"));
    $("pwd_tips").className = "input_tips_focus"
  }
  this.parentNode.className = "inputOuter_focus";
  pt.plogin.check()
},p_blur: function() {
  if (this.value == "") {
    $.css.show($("pwd_tips"));
    $("pwd_tips").className = "input_tips"
  }
  $.css.hide($("caps_lock_tips"));
  this.parentNode.className = "inputOuter"
},p_mouseover: function() {
  var a = $("p").parentNode;
  if (a.className == "inputOuter_focus") {
  } else {
    $("p").parentNode.className = "inputOuter_hover"
  }
},p_mouseout: function() {
  var a = $("p").parentNode;
  if (a.className == "inputOuter_focus") {
  } else {
    $("p").parentNode.className = "inputOuter"
  }
},p_keydown: function(a) {
  $.css.hide($("pwd_tips"))
},p_keyup: function() {
  if (this.value == "") {
    $.css.show($("pwd_tips"))
  }
},p_keypress: function(a) {
  if (pt.plogin.detectCapsLock(a)) {
    $.css.show($("caps_lock_tips"))
  } else {
    $.css.hide($("caps_lock_tips"))
  }
},vc_focus: function() {
  if (this.value == "") {
    $.css.show($("vc_tips"));
    $("vc_tips").className = "input_tips_focus"
  }
  this.parentNode.className = "inputOuter_focus"
},vc_blur: function() {
  if (this.value == "") {
    $.css.show($("vc_tips"));
    $("vc_tips").className = "input_tips"
  }
  this.parentNode.className = "inputOuter"
},vc_keydown: function() {
  $.css.hide($("vc_tips"))
},vc_keyup: function() {
  if (this.value == "") {
    $.css.show($("vc_tips"))
  }
},document_click: function() {
  pt.plogin.action[0]++;
  pt.plogin.hideEmailTips();
  pt.plogin.hideLowList()
},document_keydown: function() {
  pt.plogin.action[1]++
},setLowloginCheckbox: function() {
  if (pt.plogin.isMailLogin()) {
    pt.plogin.low_login_enable = false
  }
  if (pt.ptui.low_login == 1) {
    if (pt.plogin.low_login_enable) {
      $("q_low_login_enable").className = "checked";
      $("p_low_login_enable").className = "checked";
      $("auth_low_login_enable").className = "checked"
    } else {
      $("q_low_login_enable").className = "uncheck";
      $("p_low_login_enable").className = "uncheck";
      $("auth_low_login_enable").className = "uncheck"
    }
  }
},checkbox_click: function() {
  if (!pt.plogin.low_login_enable) {
    $("q_low_login_enable").className = "checked";
    $("p_low_login_enable").className = "checked";
    $("auth_low_login_enable").className = "checked"
  } else {
    $("q_low_login_enable").className = "uncheck";
    $("p_low_login_enable").className = "uncheck";
    $("auth_low_login_enable").className = "uncheck"
  }
  pt.plogin.low_login_enable = !pt.plogin.low_login_enable
},feedback: function(d) {
  var c = d ? d.target : null;
  var a = c ? c.id + "-" : "";
  var b = "http://support.qq.com/write.shtml?guest=1&fid=713&SSTAG=hailunna-" + a + $.str.encodeHtml(pt.plogin.accout);
  window.open(b)
},bind_account: function() {
  $.css.hide($("operate_tips"));
  pt.plogin.need_hide_operate_tips = true;
  window.open("http://id.qq.com/index.html#account");
  $.report.monitor("234964")
},combox_click: function(a) {
  if (pt.plogin.low_login_isshow) {
    pt.plogin.hideLowList()
  } else {
    pt.plogin.showLowList()
  }
  a.stopPropagation()
},delUin: function(a) {
  a && $.css.hide(a.target);
  $("u").value = "";
  pt.plogin.domFocus($("u"))
},check_cdn_img: function() {
  if (!window.g_cdn_js_fail || pt.ptui.isHttps) {
    return
  }
  var a = new Image();
  a.onload = function() {
    a.onload = a.onerror = null
  };
  a.onerror = function() {
    a.onload = a.onerror = null;
    var d = $("main_css").innerHTML;
    var b = "http://imgcache.qq.com/ptlogin/v4/style/";
    var c = "http://ui.ptlogin2.qq.com/style/";
    d = d.replace(new RegExp(b, "g"), c);
    pt.plogin.insertInlineCss(d);
    $.report.monitor(312520)
  };
  a.src = "http://imgcache.qq.com/ptlogin/v4/style/20/images/c_icon_1.png"
},insertInlineCss: function(a) {
  if (document.createStyleSheet) {
    var c = document.createStyleSheet("");
    c.cssText = a
  } else {
    var b = document.createElement("style");
    b.type = "text/css";
    b.textContent = a;
    document.getElementsByTagName("head")[0].appendChild(b)
  }
},createLink: function(a) {
  var b = document.createElement("link");
  b.setAttribute("type", "text/css");
  b.setAttribute("rel", "stylesheet");
  b.setAttribute("href", a);
  document.getElementsByTagName("head")[0].appendChild(b)
},checkInputLable: function() {
  try {
    if ($("u").value) {
      $.css.hide($("uin_tips"))
    }
    window.setTimeout(function() {
      if ($("p").value) {
        $.css.hide($("pwd_tips"))
      }
    }, 1000)
  } catch (a) {
  }
},domLoad: function(b) {
  if (pt.plogin.hasDomLoad) {
    return
  } else {
    pt.plogin.hasDomLoad = true
  }
  if (pt.plogin.isNewQr && pt.plogin.loginState == 2) {
    if (b) {
      pt.plogin.begin_qrlogin()
    } else {
      window.setTimeout(function() {
        pt.plogin.begin_qrlogin()
      }, 3000)
    }
  }
  pt.plogin.checkInputLable();
  pt.plogin.checkNPLoad();
  pt.qlogin.initFace();
  pt.plogin.loadQrTipsPic();
  var a = $("loading_img");
  if (a) {
    a.setAttribute("src", a.getAttribute("place_src"))
  }
  pt.plogin.check_cdn_img();
  pt.plogin.ptui_notifySize("login");
  $.report.monitor("373507&union=256042", 0.05);
  if (!navigator.cookieEnabled) {
    $.report.monitor(408084);
    if ($.cookie.get("ptcz")) {
      $.report.monitor(408085)
    }
  }
  pt.plogin.webLoginReport();
  pt.plogin.monitorQQNum();
  pt.plogin.aq_patch()
},checkNPLoad: function() {
  if (navigator.mimeTypes["application/nptxsso"] && !$.sso_loadComplete) {
    $.checkNPPlugin()
  }
},monitorQQNum: function() {
  var a = $.loginQQnum;
  switch (a) {
    case 0:
      $.report.monitor("330314", 0.05);
      break;
    case 1:
      $.report.monitor("330315", 0.05);
      break;
    case 2:
      $.report.monitor("330316", 0.05);
      break;
    case 3:
      $.report.monitor("330317", 0.05);
      break;
    case 4:
      $.report.monitor("330318", 0.05);
      break;
    default:
      $.report.monitor("330319", 0.05);
      break
  }
},noscript_err: function() {
  $.report.nlog("noscript_err", 316648);
  $("noscript_area").style.display = "none"
},bindEvent: function() {
  var domU = $("u");
  var domP = $("p");
  var domVerifycode = $("verifycode");
  var domVC = $("verifyimgArea");
  var domBtn = $("login_button");
  var domCheckBox_p = $("p_low_login_box");
  var domCheckBox_q = $("q_low_login_box");
  var domCheckBox_auth = $("auth_low_login_box");
  var domEmailList = $("email_list");
  var domFeedback_web = $("feedback_web");
  var domFeedback_qr = $("feedback_qr");
  var domFeedback_qlogin = $("feedback_qlogin");
  var domClose = $("close");
  var domQloginSwitch = $("switcher_qlogin");
  var domLoginSwitch = $("switcher_plogin");
  var domDelUin = $("uin_del");
  var domBindAccount = $("bind_account");
  var domCancleAuth = $("cancleAuth");
  var domAuthClose = $("authClose");
  var domAuthArea = $("auth_area");
  var domAuthCheckBox = $("auth_low_login_enable");
  var domQr_invalid = $("qr_invalid");
  var domGoback = $("goBack");
  var domQr_img_box = $("qr_img_box");
  var domQr_img = $("qrlogin_img");
  var domQr_info_link = $("qr_info_link");
  var domQrswitch = $("qrswitch_logo");
  if (domQrswitch) {
    $.e.add(domQrswitch, "click", pt.plogin.switch_qrlogin)
  }
  if (domQr_info_link) {
    $.e.add(domQr_img, "click", function(e) {
      $.report.monitor("331287", 0.05)
    })
  }
  if (domQr_img) {
    $.e.add(domQr_img, "load", pt.plogin.qr_load);
    $.e.add(domQr_img, "error", pt.plogin.qr_error)
  }
  if (domQr_img_box) {
    $.e.add(domQr_img_box, "mouseover", pt.plogin.showQrTips);
    $.e.add(domQr_img_box, "mouseout", pt.plogin.hideQrTips)
  }
  if (domGoback) {
    $.e.add(domGoback, "click", function(e) {
      e.preventDefault();
      pt.plogin.go_qrlogin_step(1);
      $.report.monitor("331288", 0.05)
    })
  }
  if (domQr_invalid) {
  }
  if (domAuthArea) {
    $.e.add(domAuthArea, "click", pt.plogin.authLogin);
    $.e.add(domAuthArea, "mousedown", pt.plogin.authMouseDowm);
    $.e.add(domAuthArea, "mouseup", pt.plogin.authMouseUp)
  }
  if (domCancleAuth) {
    $.e.add(domCancleAuth, "click", pt.plogin.cancleAuth)
  }
  if (domAuthClose) {
    $.e.add(domAuthClose, "click", pt.plogin.ptui_notifyClose)
  }
  if (domQloginSwitch) {
    $.e.add(domQloginSwitch, "click", pt.plogin.onQloginSwitch)
  }
  if (domLoginSwitch) {
    $.e.add(domLoginSwitch, "click", function(e) {
      e.preventDefault();
      pt.plogin.switchpage(1);
      $.report.monitor("331285", 0.05)
    })
  }
  if (domBindAccount) {
    $.e.add(domBindAccount, "click", pt.plogin.bind_account);
    $.e.add(domBindAccount, "mouseover", function(e) {
      pt.plogin.need_hide_operate_tips = false
    });
    $.e.add(domBindAccount, "mouseout", function(e) {
      pt.plogin.need_hide_operate_tips = true
    })
  }
  if (domClose) {
    $.e.add(domClose, "click", pt.plogin.ptui_notifyClose)
  }
  if (pt.ptui.low_login == 1 && domCheckBox_p && domCheckBox_q) {
    $.e.add(domCheckBox_p, "click", pt.plogin.checkbox_click);
    $.e.add(domCheckBox_q, "click", pt.plogin.checkbox_click)
  }
  if (pt.ptui.low_login == 1 && domCheckBox_auth) {
    $.e.add(domCheckBox_auth, "click", pt.plogin.checkbox_click)
  }
  $.e.add(domU, "focus", pt.plogin.u_focus);
  $.e.add(domU, "blur", pt.plogin.u_blur);
  $.e.add(domU, "change", pt.plogin.u_change);
  $.e.add(domU, "keydown", pt.plogin.u_keydown);
  $.e.add(domU, "keyup", pt.plogin.u_keyup);
  $.e.add(domDelUin, "click", pt.plogin.delUin);
  $.e.add(domP, "focus", pt.plogin.p_focus);
  $.e.add(domP, "blur", pt.plogin.p_blur);
  $.e.add(domP, "keydown", pt.plogin.p_keydown);
  $.e.add(domP, "keyup", pt.plogin.p_keyup);
  $.e.add(domP, "keypress", pt.plogin.p_keypress);
  $.e.add(domBtn, "click", function(e) {
    e && e.preventDefault();
    if (pt.plogin.needShowNewVc == true) {
      pt.plogin.showVC()
    } else {
      pt.plogin.submit(e)
    }
  });
  $.e.add(domVC, "click", pt.plogin.changeVC);
  $.e.add(domEmailList, "mousemove", pt.plogin.email_mousemove);
  $.e.add(domEmailList, "click", pt.plogin.email_click);
  $.e.add(document, "click", pt.plogin.document_click);
  $.e.add(document, "keydown", pt.plogin.document_keydown);
  $.e.add(domVerifycode, "focus", pt.plogin.vc_focus);
  $.e.add(domVerifycode, "blur", pt.plogin.vc_blur);
  $.e.add(domVerifycode, "keydown", pt.plogin.vc_keydown);
  $.e.add(domVerifycode, "keyup", pt.plogin.vc_keyup);
  $.e.add(window, "load", pt.plogin.domLoad);
  $.e.add(window, "message", function(e) {
    var origin = e.origin;
    if (origin == (pt.ptui.isHttps ? "https://ssl." : "http://") + "captcha.qq.com") {
      var data = e.data;
      if (window.JSON) {
        data = JSON.parse(data)
      } else {
        data = eval("(" + data + ")")
      }
      var type = data.type;
      switch (type + "") {
        case "1":
          pt.plogin.vcodeMessage(data);
          break;
        case "2":
          pt.plogin.hideVC();
          break
      }
    }
  });
  navigator.captcha_callback = function(data) {
    var type = data.type;
    switch (type + "") {
      case "1":
        pt.plogin.vcodeMessage(data);
        break;
      case "2":
        pt.plogin.hideVC();
        break
    }
  };
  var noscript_img = $("noscript_img");
  if (noscript_img) {
    $.e.add(noscript_img, "load", pt.plogin.noscript_err);
    $.e.add(noscript_img, "error", pt.plogin.noscript_err)
  }
},vcodeMessage: function(a) {
  if (!a.randstr || !a.sig) {
    $.report.nlog("vcode postMessage error：" + e.data)
  }
  $("verifycode").value = a.randstr;
  pt.plogin.pt_verifysession = a.sig;
  pt.plogin.hideVC();
  pt.plogin.submit()
},showNewVC: function() {
  var a = pt.plogin.getNewVCUrl();
  var b = $("newVcodeArea");
  b.style.height = $("login").offsetHeight - (pt.ptui.style == 21 ? 2 : 4) + "px";
  b.innerHTML = '<iframe name="vcode" allowtransparency="true" scrolling="no" frameborder="0" width="100%" height="100%" src="' + a + '">';
  $.css.show(b)
},hideNewVC: function() {
  $.css.hide($("newVcodeArea"))
},changeNewVC: function() {
  pt.plogin.showNewVC()
},showVC: function() {
  pt.plogin.vcFlag = true;
  if (pt.ptui.pt_vcode_v1 == "1") {
    pt.plogin.showNewVC()
  } else {
    $.css.show($("verifyArea"));
    $("verifycode").value = "";
    var a = $("verifyimg");
    var b = pt.plogin.getVCUrl();
    a.src = b
  }
  pt.plogin.ptui_notifySize("login")
},hideVC: function() {
  pt.plogin.vcflag = false;
  if (pt.ptui.pt_vcode_v1 == "1") {
    pt.plogin.hideNewVC()
  } else {
    $.css.hide($("verifyArea"))
  }
  pt.plogin.ptui_notifySize("login")
},changeVC: function(b) {
  b && b.preventDefault();
  var a = $("verifyimg");
  var c = pt.plogin.getVCUrl();
  a.src = c;
  b && $.report.monitor("330322", 0.05)
},getVCUrl: function() {
  var d = pt.plogin.at_accout;
  var c = pt.ptui.domain;
  var b = pt.ptui.appid;
  var a = pt.plogin.verifycodeUrl + "?uin=" + d + "&aid=" + b + "&cap_cd=" + pt.plogin.cap_cd + "&" + Math.random();
  return a
},getNewVCUrl: function() {
  var d = pt.plogin.at_accout;
  var c = pt.ptui.domain;
  var b = pt.ptui.appid;
  var a = pt.plogin.newVerifycodeUrl + "&uin=" + d + "&aid=" + b + "&cap_cd=" + pt.plogin.cap_cd + "&" + Math.random();
  return a
},checkValidate: function(b) {
  try {
    var a = b.u;
    var d = b.p;
    var f = b.verifycode;
    if ($.str.trim(a.value) == "") {
      pt.plogin.show_err(pt.str.no_uin);
      pt.plogin.domFocus(a);
      return false
    }
    if ($.check.isNullQQ(a.value)) {
      pt.plogin.show_err(pt.str.inv_uin);
      pt.plogin.domFocus(a);
      return false
    }
    if (d.value == "") {
      pt.plogin.show_err(pt.str.no_pwd);
      pt.plogin.domFocus(d);
      return false
    }
    if (f.value == "") {
      if (!pt.plogin.needVc && !pt.plogin.vcFlag) {
        pt.plogin.checkResultReport(14);
        clearTimeout(pt.plogin.checkClock);
        pt.plogin.showVC()
      } else {
        pt.plogin.show_err(pt.str.no_vcode);
        pt.plogin.domFocus(f)
      }
      return false
    }
    if (f.value.length < 4) {
      pt.plogin.show_err(pt.str.inv_vcode);
      pt.plogin.domFocus(f);
      f.select();
      return false
    }
  } catch (c) {
  }
  return true
},checkTimeout: function() {
  var a = $.str.trim($("u").value);
  if ($.check.isQQ(a) || $.check.isQQMail(a)) {
    pt.plogin.cap_cd = 0;
    pt.plogin.saltUin = $.str.uin2hex(a.replace("@qq.com", ""));
    pt.plogin.needVc = true;
    pt.plogin.needShowNewVc = true;
    pt.plogin.showVC();
    pt.plogin.isCheckTimeout = true;
    pt.plogin.checkRet = 1
  }
},loginTimeout: function() {
  pt.plogin.showAssistant(2);
  var a = "flag1=7808&flag2=7&flag3=1&1=1000";
  $.report.simpleIsdSpeed(a)
},check: function() {
  if (!pt.plogin.accout) {
    pt.plogin.set_accout()
  }
  if ($.check.isNullQQ(pt.plogin.accout)) {
    pt.plogin.show_err(pt.str.inv_uin);
    return false
  }
  if (pt.plogin.accout == pt.plogin.lastCheckAccout || pt.plogin.accout == "") {
    return
  }
  pt.plogin.lastCheckAccout = pt.plogin.accout;
  var b = pt.ptui.appid;
  var a = pt.plogin.getCheckUrl(pt.plogin.at_accout, b);
  pt.plogin.isCheckTimeout = false;
  clearTimeout(pt.plogin.checkClock);
  pt.plogin.checkClock = setTimeout("pt.plogin.checkTimeout();", 5000);
  $.http.loadScript(a)
},getCheckUrl: function(b, c) {
  var a = pt.plogin.checkUrl + "?regmaster=" + pt.ptui.regmaster + "&";
  a += "uin=" + b + "&appid=" + c + "&js_ver=" + pt.ptui.ptui_version + "&js_type=" + pt.plogin.js_type + "&login_sig=" + pt.ptui.login_sig + "&u1=" + encodeURIComponent(pt.ptui.s_url) + "&r=" + Math.random();
  return a
},getSubmitUrl: function(b) {
  var a = pt.plogin.loginUrl + b + "?";
  var d = {};
  if (b == "login") {
    d.u = encodeURIComponent(pt.plogin.at_accout);
    d.verifycode = $("verifycode").value;
    if (pt.plogin.needShowNewVc && pt.plogin.pt_verifysession) {
      d.pt_vcode_v1 = 1;
      d.pt_verifysession_v1 = pt.plogin.pt_verifysession
    }
    if (pt.plogin.RSAKey) {
      d.p = $.Encryption.getRSAEncryption($("p").value, d.verifycode);
      d.pt_rsa = 1
    } else {
      d.p = $.Encryption.getEncryption($("p").value, pt.plogin.saltUin, d.verifycode);
      d.pt_rsa = 0
    }
  }
  if (b == "login") {
    d.u1 = encodeURIComponent(pt.qlogin.getSurl($("u").value))
  } else {
    d.u1 = encodeURIComponent(pt.qlogin.getSurl())
  }
  d.ptredirect = pt.ptui.target;
  d.h = 1;
  d.t = 1;
  d.g = 1;
  d.from_ui = 1;
  d.ptlang = pt.ptui.lang;
  d.action = pt.plogin.action.join("-") + "-" + (new Date() - 0);
  d.js_ver = pt.ptui.ptui_version;
  d.js_type = pt.plogin.js_type;
  d.login_sig = pt.ptui.login_sig;
  d.pt_uistyle = pt.ptui.style;
  if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable && !pt.plogin.isMailLogin()) {
    d.low_login_enable = 1;
    d.low_login_hour = pt.plogin.low_login_hour
  }
  if (pt.ptui.csimc != "0") {
    d.csimc = pt.ptui.csimc;
    d.csnum = pt.ptui.csimc;
    d.authid = pt.ptui.csimc
  }
  d.aid = pt.ptui.appid;
  if (pt.ptui.daid) {
    d.daid = pt.ptui.daid
  }
  if (pt.ptui.pt_3rd_aid != "0") {
    d.pt_3rd_aid = pt.ptui.pt_3rd_aid
  }
  if (pt.ptui.regmaster) {
    d.regmaster = pt.ptui.regmaster
  }
  if (pt.ptui.mibao_css) {
    d.mibao_css = pt.ptui.mibao_css
  }
  if (pt.ptui.pt_qzone_sig == "1") {
    d.pt_qzone_sig = 1
  }
  if (pt.ptui.pt_light == "1") {
    d.pt_light = 1
  }
  for (var c in d) {
    a += (c + "=" + d[c] + "&")
  }
  return a
},submit: function(a) {
  pt.plogin.submitTime = new Date().getTime();
  a && a.preventDefault();
  if (!pt.plogin.ptui_onLogin(document.loginform)) {
    return false
  } else {
    $.cookie.set("ptui_loginuin", escape(document.loginform.u.value), pt.ptui.domain, "/", 24 * 30)
  }
  if (pt.plogin.checkRet == -1 || pt.plogin.checkRet == 3) {
    pt.plogin.show_err(pt.plogin.checkErr[pt.ptui.lang]);
    pt.plogin.lastCheckAccout = "";
    pt.plogin.domFocus($("p"));
    return
  }
  clearTimeout(pt.plogin.loginClock);
  pt.plogin.loginClock = setTimeout("pt.plogin.loginTimeout();", 5000);
  var b = pt.plogin.getSubmitUrl("login");
  $.winName.set("login_href", encodeURIComponent(pt.ptui.href));
  pt.plogin.showLoading(20);
  if (pt.plogin.isVCSessionTimeOut() && !pt.plogin.needVc) {
    pt.plogin.lastCheckAccout = "";
    pt.plogin.check();
    window.setTimeout(function() {
      pt.plogin.submit()
    }, 1000)
  } else {
    $.http.loadScript(b);
    pt.plogin.isdTime["7808-7-2-0"] = new Date().getTime()
  }
  return false
},isVCSessionTimeOut: function() {
  pt.plogin.checkTime = pt.plogin.checkTime || new Date().getTime();
  if (pt.plogin.submitTime - pt.plogin.checkTime > 1200000) {
    $.report.monitor(330323, 0.05);
    return true
  } else {
    return false
  }
},webLoginReport: function() {
  window.setTimeout(function() {
    try {
      var d = ["navigationStart", "unloadEventStart", "unloadEventEnd", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "requestStart", "responseStart", "responseEnd", "domLoading", "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd"];
      var g = {};
      var c = window.performance ? window.performance.timing : null;
      if (c) {
        for (var b = 1, a = d.length; b < a; b++) {
          if (c[d[b]]) {
            g[b] = c[d[b]] - c[d[0]]
          }
        }
        if ((c.domContentLoadedEventEnd - c.navigationStart > pt.plogin.delayTime) && c.navigationStart > 0) {
          $.report.nlog("访问ui延时超过" + pt.plogin.delayTime / 1000 + "s:delay=" + (c.domContentLoadedEventEnd - c.navigationStart) + ";domContentLoadedEventEnd=" + c.domContentLoadedEventEnd + ";navigationStart=" + c.navigationStart + ";clientip=" + pt.ptui.clientip + ";serverip=" + pt.ptui.serverip, pt.plogin.delayMonitorId, 1)
        }
        if (c.connectStart <= c.connectEnd && c.responseStart <= c.responseEnd) {
          pt.plogin.ptui_speedReport(g)
        }
      }
    } catch (f) {
    }
  }, 1000)
},ptui_speedReport: function(d) {
  if ($.browser("type") != "msie" && $.browser("type") != "webkit") {
    return
  }
  var b = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=1";
  if (pt.ptui.isHttps) {
    if (Math.random() > 1) {
      return
    }
    if ($.browser("type") == "msie") {
      if ($.check.isSsl()) {
        b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=3"
      } else {
        b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=2"
      }
    } else {
      if ($.check.isSsl()) {
        b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=6"
      } else {
        b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=5"
      }
    }
  } else {
    if (Math.random() > 0.2) {
      return
    }
    if ($.browser("type") == "msie") {
      b = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=1"
    } else {
      b = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=4"
    }
  }
  for (var c in d) {
    if (d[c] > 15000 || d[c] < 0) {
      continue
    }
    b += "&" + c + "=" + d[c] || 1
  }
  var a = new Image();
  a.src = b
},resultReport: function(b, a, f) {
  var d = "http://isdspeed.qq.com/cgi-bin/v.cgi?flag1=" + b + "&flag2=" + a + "&flag3=" + f;
  var c = new Image();
  c.src = d
},crossMessage: function(d) {
  if (typeof window.postMessage != "undefined") {
    var b = $.str.json2str(d);
    window.parent.postMessage(b, "*")
  } else {
    if (!pt.ptui.proxy_url) {
      try {
        navigator.ptlogin_callback($.str.json2str(d))
      } catch (c) {
        $.report.nlog(c.message)
      }
    } else {
      var f = pt.ptui.proxy_url + "#";
      for (var a in d) {
        f += (a + "=" + d[a] + "&")
      }
      $("proxy") && ($("proxy").innerHTML = '<iframe src="' + encodeURI(f) + '"></iframe>')
    }
  }
},ptui_notifyClose: function(a) {
  a && a.preventDefault();
  var b = {};
  b.action = "close";
  pt.plogin.crossMessage(b);
  pt.plogin.cancle_qrlogin()
},ptui_notifySize: function(c) {
  if (pt.plogin.loginState == 1) {
    $("bottom_web") && $.css.hide($("bottom_web"));
    pt.plogin.adjustLoginsize();
    $("bottom_web") && $.css.show($("bottom_web"))
  }
  var a = $(c);
  var b = {};
  b.action = "resize";
  b.width = a.offsetWidth || 1;
  b.height = a.offsetHeight || 1;
  pt.plogin.crossMessage(b)
},ptui_onLogin: function(b) {
  var a = true;
  a = pt.plogin.checkValidate(b);
  return a
},ptui_uin: function(a) {
},is_mibao: function(a) {
  return /^http(s)?:\/\/ui.ptlogin2.(\S)+\/cgi-bin\/mibao_vry/.test(a)
},get_qrlogin_pic: function() {
  var b = "ptqrshow";
  var a = (pt.ptui.isHttps ? "https://ssl." : "http://") + "ptlogin2." + pt.ptui.domain + "/" + b + "?";
  if (pt.ptui.regmaster == 2) {
    a = "http://ptlogin2.function.qq.com/" + b + "?regmaster=2&"
  } else {
    if (pt.ptui.regmaster == 3) {
      a = "http://ptlogin2.crm2.qq.com/" + b + "?regmaster=3&"
    }
  }
  a += "appid=" + pt.ptui.appid + "&e=2&l=M&s=3&d=72&v=4&t=" + Math.random();
  return a
},go_qrlogin_step: function(a) {
  switch (a) {
    case 1:
      pt.plogin.begin_qrlogin();
      if (pt.plogin.isNewQr) {
        pt.plogin.begin_qrlogin();
        $.css.hide($("qrlogin_step2"))
      } else {
        $.css.show($("qrlogin_step1"));
        $.css.hide($("qrlogin_step2"))
      }
      break;
    case 2:
      if (pt.plogin.isNewQr) {
        $("qrlogin_step2").style.height = ($("login").offsetHeight - 8) + "px";
        $.css.show($("qrlogin_step2"))
      } else {
        $.css.show($("qrlogin_step2"));
        $.css.hide($("qrlogin_step1"))
      }
      break;
    default:
      break
  }
},begin_qrlogin: function() {
  if (pt.plogin.isTenpay && pt.ptui.defaultUin) {
    return
  }
  pt.plogin.cancle_qrlogin();
  $("qr_invalid") && $.css.hide($("qr_invalid"));
  $("qrlogin_img") && ($("qrlogin_img").src = pt.plogin.get_qrlogin_pic());
  pt.plogin.qrlogin_clock = window.setInterval("pt.plogin.qrlogin_submit();", 3000);
  pt.plogin.qrlogin_timeout = window.setTimeout(function() {
    pt.plogin.set_qrlogin_invalid()
  }, pt.plogin.qrlogin_timeout_time)
},cancle_qrlogin: function() {
  window.clearInterval(pt.plogin.qrlogin_clock);
  window.clearTimeout(pt.plogin.qrlogin_timeout)
},set_qrlogin_invalid: function() {
  pt.plogin.cancle_qrlogin();
  pt.plogin.switch_qrlogin();
  $("qr_invalid") && $.css.show($("qr_invalid"));
  pt.plogin.hideQrTips()
},createLink: function(a) {
  var b = document.createElement("link");
  b.setAttribute("type", "text/css");
  b.setAttribute("rel", "stylesheet");
  b.setAttribute("href", a);
  document.getElementsByTagName("head")[0].appendChild(b)
},loadQrTipsPic: function() {
  if (pt.plogin.isNewQr) {
    var b = $("qr_tips_pic");
    var d = "chs";
    switch (pt.ptui.lang + "") {
      case "2052":
        d = "chs";
        break;
      case "1033":
        d = "en";
        break;
      case "1028":
        d = "cht";
        break
    }
    $.css.addClass(b, "qr_tips_pic_" + d)
  } else {
    var a = pt.ptui.cssPath + "/c_qr_login.css";
    $("qrswitch_logo") && pt.plogin.createLink(a)
  }
},showQrTips: function() {
  var a = {}, f, d;
  d = $.css.getOffsetPosition("qrlogin_img");
  f = $.css.getOffsetPosition("login");
  a.left = d.left - f.left;
  a.right = $("login").offsetWidth - $("qrlogin_img").offsetWidth - a.left;
  if (pt.plogin.hasNoQlogin) {
  } else {
    a.left = a.left + $.css.getWidth("qrlogin_img") + 10;
    $("qr_tips").style.left = a.left + "px"
  }
  $.css.show($("qr_tips"));
  $("qr_tips_pic").style.opacity = 0;
  $("qr_tips_pic").style.filter = "alpha(opacity=0)";
  $("qr_tips_menban").className = "qr_tips_menban";
  if (pt.plogin.hasNoQlogin) {
    $.animate.fade("qr_tips_pic", 100, 2, 20, function() {
    });
    if (pt.plogin.isMailLogin()) {
      var b = 160;
      var c = a.right - 160 + 12;
      $.animate.animate("qrlogin_img", {left: c}, 10, 10)
    } else {
      $.animate.animate("qrlogin_img", {left: -30}, 10, 10)
    }
  } else {
    $.animate.fade("qr_tips_pic", 100, 2, 20)
  }
  pt.plogin.hideQrTipsClock = window.setTimeout("pt.plogin.hideQrTips()", 5000);
  $.report.monitor("331286", 0.05)
},hideQrTips: function() {
  if (!pt.plogin.isNewQr) {
    return
  }
  window.clearTimeout(pt.plogin.hideQrTipsClock);
  $("qr_tips_menban").className = "";
  $.animate.fade("qr_tips_pic", 0, 5, 20, function() {
    if (pt.plogin.hasNoQlogin) {
      $.animate.animate("qrlogin_img", {left: 12}, 10, 10)
    }
    $.css.hide($("qr_tips"))
  })
},qr_load: function(a) {
},qr_error: function(a) {
  pt.plogin.set_qrlogin_invalid()
},switch_qrlogin_animate: function() {
  var b = pt.plogin.isQrLogin;
  var a = $("web_qr_login_show");
  var c = 0;
  if (b) {
    c = -$("web_login").offsetHeight;
    $("web_qr_login").style.height = ($("qrlogin").offsetHeight || 265) + "px";
    $("qrlogin").style.visibility = "";
    $("web_login").style.visibility = "hidden"
  } else {
    c = 0;
    $("web_qr_login").style.height = $("web_login").offsetHeight + "px";
    $("web_login").style.visibility = "";
    $("qrlogin").style.visibility = "hidden"
  }
  $.animate.animate(a, {top: c}, 30, 20)
},switch_qrlogin: function(a) {
  if (pt.plogin.isNewQr) {
    return
  }
  a && a.preventDefault();
  pt.plogin.hide_err();
  if (!pt.plogin.isQrLogin) {
    pt.plogin.go_qrlogin_step(1);
    $("qrswitch_logo").title = "返回";
    $("qrswitch_logo").className = "qrswitch_logo_qr";
    pt.plogin.begin_qrlogin();
    $.report.monitor("273367", 0.05)
  } else {
    pt.plogin.cancle_qrlogin();
    $("qrswitch_logo").title = "二维码登录";
    $("qrswitch_logo").className = "qrswitch_logo";
    $.report.monitor("273368", 0.05)
  }
  pt.plogin.isQrLogin = !pt.plogin.isQrLogin;
  pt.plogin.switch_qrlogin_animate();
  pt.plogin.ptui_notifySize("login")
},adjustLoginsize: function() {
  var a = pt.plogin.isQrLogin;
  if (a) {
    $("web_qr_login").style.height = ($("qrlogin").offsetHeight || 265) + "px"
  } else {
    $("web_qr_login").style.height = $("web_login").offsetHeight + "px"
  }
},qrlogin_submit: function() {
  var a = pt.plogin.getSubmitUrl("ptqrlogin");
  $.winName.set("login_href", encodeURIComponent(pt.ptui.href));
  $.http.loadScript(a);
  return
},force_qrlogin: function() {
},no_force_qrlogin: function() {
},redirect: function(b, a) {
  switch (b + "") {
    case "0":
      location.href = a;
      break;
    case "1":
      top.location.href = a;
      break;
    default:
      top.location.href = a
  }
}};
pt.plogin.auth();
function ptuiCB(k, n, b, h, c, a) {
  var m = pt.plogin.at_accout && $("p").value;
  clearTimeout(pt.plogin.loginClock);
  function d() {
    if (pt.plogin.is_mibao(b)) {
      b += ("&style=" + pt.ptui.style + "&proxy_url=" + encodeURIComponent(pt.ptui.proxy_url))
    }
    pt.plogin.redirect(h, b)
  }
  if (m) {
    pt.plogin.lastCheckAccout = ""
  }
  pt.plogin.hasSubmit = true;
  switch (k) {
    case "0":
      if (!m && !pt.plogin.is_mibao(b)) {
        window.clearInterval(pt.plogin.qrlogin_clock);
        d()
      } else {
        d()
      }
      break;
    case "3":
      $("p").value = "";
      pt.plogin.domFocus($("p"));
      pt.plogin.passwordErrorNum++;
      if (n == "101" || n == "102" || n == "103") {
        pt.plogin.showVC()
      }
      pt.plogin.check();
      break;
    case "4":
      if (pt.plogin.vcFlag) {
        pt.plogin.changeVC()
      } else {
        pt.plogin.showVC()
      }
      try {
        $("verifycode").focus();
        $("verifycode").select()
      } catch (j) {
      }
      break;
    case "65":
      pt.plogin.set_qrlogin_invalid();
      return;
    case "66":
      return;
    case "67":
      pt.plogin.go_qrlogin_step(2);
      return;
    case "10005":
      pt.plogin.force_qrlogin();
      break;
    default:
      if (pt.plogin.needVc) {
        pt.plogin.changeVC()
      } else {
        pt.plogin.check()
      }
      break
  }
  if (k == "10005" || k == "12" || k == "51") {
    pt.plogin.show_err(c, true)
  } else {
    if (k != 0 && m) {
      pt.plogin.show_err(c)
    }
  }
  if (!pt.plogin.hasCheck && m) {
    pt.plogin.showVC();
    $("verifycode").focus();
    $("verifycode").select()
  }
  if (Math.random() < 0.2) {
    pt.plogin.isdTime["7808-7-2-1"] = new Date().getTime();
    var g = 1;
    if (pt.ptui.isHttps) {
      g = 2
    }
    var l = "flag1=7808&flag2=7&flag3=2&" + g + "=" + (pt.plogin.isdTime["7808-7-2-1"] - pt.plogin.isdTime["7808-7-2-0"]);
    $.report.simpleIsdSpeed(l)
  }
}
function ptui_checkVC(a, c, b) {
  clearTimeout(pt.plogin.checkClock);
  pt.plogin.saltUin = b;
  pt.plogin.checkRet = a;
  if (!b) {
    pt.plogin.RSAKey = true
  } else {
    pt.plogin.RSAKey = false
  }
  if (a == "2") {
    pt.plogin.show_err(pt.str.inv_uin)
  } else {
    if (a == "3") {
    } else {
      if (!pt.plogin.hasSubmit) {
        pt.plogin.hide_err()
      }
    }
  }
  switch (a + "") {
    case "0":
    case "2":
    case "3":
      if (pt.ptui.pt_vcode_v1 == "1") {
        pt.plogin.needShowNewVc = false
      }
      pt.plogin.hideVC();
      $("verifycode").value = c || "abcd";
      pt.plogin.needVc = false;
      $.report.monitor("330321", 0.05);
      break;
    case "1":
      pt.plogin.cap_cd = c;
      if (pt.ptui.pt_vcode_v1 == "1") {
        pt.plogin.needShowNewVc = true
      } else {
        pt.plogin.showVC();
        $.css.show($("vc_tips"))
      }
      pt.plogin.needVc = true;
      $.report.monitor("330320", 0.05);
      break;
    default:
      break
  }
  pt.plogin.domFocus($("p"));
  pt.plogin.hasCheck = true;
  pt.plogin.checkTime = new Date().getTime()
}
function ptui_auth_CB(c, b) {
  switch (parseInt(c)) {
    case 0:
      pt.plogin.authUin = $.cookie.get("superuin").replace(/^o0*/, "");
      pt.plogin.authSubmitUrl = b;
      pt.plogin.init(b);
      break;
    case 1:
      pt.plogin.init();
      break;
    case 2:
      var a = b + "&regmaster=" + pt.ptui.regmaster + "&aid=" + pt.ptui.appid + "&s_url=" + encodeURIComponent(pt.ptui.s_url);
      if (pt.ptui.pt_light == "1") {
        a += "&pt_light=1"
      }
      pt.plogin.redirect(pt.ptui.target, a);
      break;
    default:
      pt.preload.init()
  }
}
;
