var $ = window.Simple = function (A) {
  return typeof (A) == "string" ? document.getElementById(A) : A
};
$.cookie = {get: function (B) {
  var A = document.cookie.match(new RegExp("(^| )" + B + "=([^;]*)(;|$)"));
  return !A ? "" : decodeURIComponent(A[2])
}, getOrigin: function (B) {
  var A = document.cookie.match(new RegExp("(^| )" + B + "=([^;]*)(;|$)"));
  return !A ? "" : (A[2])
}, set: function (C, E, D, F, A) {
  var B = new Date();
  if (A) {
    B.setTime(B.getTime() + 3600000 * A);
    document.cookie = C + "=" + E + "; expires=" + B.toGMTString() + "; path=" + (F ? F : "/") + "; " + (D ? ("domain=" + D + ";") : "")
  } else {
    document.cookie = C + "=" + E + "; path=" + (F ? F : "/") + "; " + (D ? ("domain=" + D + ";") : "")
  }
}, del: function (A, B, C) {
  document.cookie = A + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + (C ? C : "/") + "; " + (B ? ("domain=" + B + ";") : "")
}, uin: function () {
  var A = $.cookie.get("uin");
  return !A ? null : parseInt(A.substring(1, A.length), 10)
}};
$.http = {getXHR: function () {
  return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest()
}, ajax: function (url, para, cb, method, type) {
  var xhr = $.http.getXHR();
  xhr.open(method, url);
  xhr.onreadystatechange = function () {
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
}, post: function (C, B, A, F) {
  var E = "";
  for (var D in B) {
    E += "&" + D + "=" + B[D]
  }
  return $.http.ajax(C, E, A, "POST", F)
}, get: function (C, B, A, E) {
  var F = [];
  for (var D in B) {
    F.push(D + "=" + B[D])
  }
  if (C.indexOf("?") == -1) {
    C += "?"
  }
  C += F.join("&");
  return $.http.ajax(C, null, A, "GET", E)
}, jsonp: function (A) {
  var B = document.createElement("script");
  B.src = A;
  document.getElementsByTagName("head")[0].appendChild(B)
}, loadScript: function (C, D, B) {
  var A = document.createElement("script");
  A.onload = A.onreadystatechange = function () {
    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
      if (typeof D == "function") {
        D()
      }
      A.onload = A.onreadystatechange = null;
      if (A.parentNode) {
        A.parentNode.removeChild(A)
      }
    }
  };
  A.src = C;
  document.getElementsByTagName("head")[0].appendChild(A)
}, preload: function (A) {
  var B = document.createElement("img");
  B.src = A;
  B = null
}};
$.get = $.http.get;
$.post = $.http.post;
$.jsonp = $.http.jsonp;
$.browser = function (B) {
  if (typeof $.browser.info == "undefined") {
    var A = {type: ""};
    var C = navigator.userAgent.toLowerCase();
    if (/webkit/.test(C)) {
      A = {type: "webkit", version: /webkit[\/ ]([\w.]+)/}
    } else {
      if (/opera/.test(C)) {
        A = {type: "opera", version: /version/.test(C) ? /version[\/ ]([\w.]+)/ : /opera[\/ ]([\w.]+)/}
      } else {
        if (/msie/.test(C)) {
          A = {type: "msie", version: /msie ([\w.]+)/}
        } else {
          if (/mozilla/.test(C) && !/compatible/.test(C)) {
            A = {type: "ff", version: /rv:([\w.]+)/}
          }
        }
      }
    }
    A.version = (A.version && A.version.exec(C) || [0, "0"])[1];
    $.browser.info = A
  }
  return $.browser.info[B]
};
$.e = {_counter: 0, _uid: function () {
  return"h" + $.e._counter++
}, add: function (C, B, E) {
  if (typeof C != "object") {
    C = $(C)
  }
  if (document.addEventListener) {
    C.addEventListener(B, E, false)
  } else {
    if (document.attachEvent) {
      if ($.e._find(C, B, E) != -1) {
        return
      }
      var F = function (J) {
        if (!J) {
          J = window.event
        }
        var I = {_event: J, type: J.type, target: J.srcElement, currentTarget: C, relatedTarget: J.fromElement ? J.fromElement : J.toElement, eventPhase: (J.srcElement == C) ? 2 : 3, clientX: J.clientX, clientY: J.clientY, screenX: J.screenX, screenY: J.screenY, altKey: J.altKey, ctrlKey: J.ctrlKey, shiftKey: J.shiftKey, keyCode: J.keyCode, data: J.data, origin: J.origin, stopPropagation: function () {
          this._event.cancelBubble = true
        }, preventDefault: function () {
          this._event.returnValue = false
        }};
        if (Function.prototype.call) {
          E.call(C, I)
        } else {
          C._currentHandler = E;
          C._currentHandler(I);
          C._currentHandler = null
        }
      };
      C.attachEvent("on" + B, F);
      var D = {element: C, eventType: B, handler: E, wrappedHandler: F};
      var G = C.document || C;
      var A = G.parentWindow;
      var H = $.e._uid();
      if (!A._allHandlers) {
        A._allHandlers = {}
      }
      A._allHandlers[H] = D;
      if (!C._handlers) {
        C._handlers = []
      }
      C._handlers.push(H);
      if (!A._onunloadHandlerRegistered) {
        A._onunloadHandlerRegistered = true;
        A.attachEvent("onunload", $.e._removeAllHandlers)
      }
    }
  }
}, remove: function (D, C, F) {
  if (document.addEventListener) {
    D.removeEventListener(C, F, false)
  } else {
    if (document.attachEvent) {
      var B = $.e._find(D, C, F);
      if (B == -1) {
        return
      }
      var H = D.document || D;
      var A = H.parentWindow;
      var G = D._handlers[B];
      var E = A._allHandlers[G];
      D.detachEvent("on" + C, E.wrappedHandler);
      D._handlers.splice(B, 1);
      delete A._allHandlers[G]
    }
  }
}, _find: function (D, A, I) {
  var B = D._handlers;
  if (!B) {
    return -1
  }
  var G = D.document || D;
  var H = G.parentWindow;
  for (var E = B.length - 1; E >= 0; E--) {
    var C = B[E];
    var F = H._allHandlers[C];
    if (F.eventType == A && F.handler == I) {
      return E
    }
  }
  return -1
}, _removeAllHandlers: function () {
  var A = this;
  for (id in A._allHandlers) {
    var B = A._allHandlers[id];
    B.element.detachEvent("on" + B.eventType, B.wrappedHandler);
    delete A._allHandlers[id]
  }
}, src: function (A) {
  return A ? A.target : event.srcElement
}, stopPropagation: function (A) {
  A ? A.stopPropagation() : event.cancelBubble = true
}, trigger: function (C, B) {
  var E = {HTMLEvents: "abort,blur,change,error,focus,load,reset,resize,scroll,select,submit,unload", UIEevents: "keydown,keypress,keyup", MouseEvents: "click,mousedown,mousemove,mouseout,mouseover,mouseup"};
  if (document.createEvent) {
    var D = "";
    (B == "mouseleave") && (B = "mouseout");
    (B == "mouseenter") && (B = "mouseover");
    for (var F in E) {
      if (E[F].indexOf(B)) {
        D = F;
        break
      }
    }
    var A = document.createEvent(D);
    A.initEvent(B, true, false);
    C.dispatchEvent(A)
  } else {
    if (document.createEventObject) {
      C.fireEvent("on" + B)
    }
  }
}};
$.bom = {query: function (B) {
  var A = window.location.search.match(new RegExp("(\\?|&)" + B + "=([^&]*)(&|$)"));
  return !A ? "" : decodeURIComponent(A[2])
}, getHash: function (B) {
  var A = window.location.hash.match(new RegExp("(#|&)" + B + "=([^&]*)(&|$)"));
  return !A ? "" : decodeURIComponent(A[2])
}};
$.winName = {set: function (C, A) {
  var B = window.name || "";
  if (B.match(new RegExp(";" + C + "=([^;]*)(;|$)"))) {
    window.name = B.replace(new RegExp(";" + C + "=([^;]*)"), ";" + C + "=" + A)
  } else {
    window.name = B + ";" + C + "=" + A
  }
}, get: function (C) {
  var B = window.name || "";
  var A = B.match(new RegExp(";" + C + "=([^;]*)(;|$)"));
  return A ? A[1] : ""
}, clear: function (B) {
  var A = window.name || "";
  window.name = A.replace(new RegExp(";" + B + "=([^;]*)"), "")
}};
$.localData = function () {
  var A = "ptlogin2.qq.com";
  var D = /^[0-9A-Za-z_-]*$/;
  var B;

  function C() {
    var G = document.createElement("link");
    G.style.display = "none";
    G.id = A;
    document.getElementsByTagName("head")[0].appendChild(G);
    G.addBehavior("#default#userdata");
    return G
  }

  function E() {
    if (typeof B == "undefined") {
      if (window.localStorage) {
        B = localStorage
      } else {
        try {
          B = C();
          B.load(A)
        } catch (G) {
          B = false;
          return false
        }
      }
    }
    return true
  }

  function F(G) {
    if (typeof G != "string") {
      return false
    }
    return D.test(G)
  }

  return{set: function (G, H) {
    var J = false;
    if (F(G) && E()) {
      try {
        H += "";
        if (window.localStorage) {
          B.setItem(G, H);
          J = true
        } else {
          B.setAttribute(G, H);
          B.save(A);
          J = B.getAttribute(G) === H
        }
      } catch (I) {
      }
    }
    return J
  }, get: function (G) {
    if (F(G) && E()) {
      try {
        return window.localStorage ? B.getItem(G) : B.getAttribute(G)
      } catch (H) {
      }
    }
    return null
  }, remove: function (G) {
    if (F(G) && E()) {
      try {
        window.localStorage ? B.removeItem(G) : B.removeAttribute(G);
        return true
      } catch (H) {
      }
    }
    return false
  }}
}();
$.str = (function () {
  var htmlDecodeDict = {quot: '"', lt: "<", gt: ">", amp: "&", nbsp: " ", "#34": '"', "#60": "<", "#62": ">", "#38": "&", "#160": " "};
  var htmlEncodeDict = {'"': "#34", "<": "#60", ">": "#62", "&": "#38", " ": "#160"};
  return{decodeHtml: function (s) {
    s += "";
    return s.replace(/&(quot|lt|gt|amp|nbsp);/ig,function (all, key) {
      return htmlDecodeDict[key]
    }).replace(/&#u([a-f\d]{4});/ig,function (all, hex) {
      return String.fromCharCode(parseInt("0x" + hex))
    }).replace(/&#(\d+);/ig, function (all, number) {
      return String.fromCharCode(+number)
    })
  }, encodeHtml: function (s) {
    s += "";
    return s.replace(/["<>& ]/g, function (all) {
      return"&" + htmlEncodeDict[all] + ";"
    })
  }, trim: function (str) {
    str += "";
    var str = str.replace(/^\s+/, ""), ws = /\s/, end = str.length;
    while (ws.test(str.charAt(--end))) {
    }
    return str.slice(0, end + 1)
  }, uin2hex: function (str) {
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
  }, bin2String: function (a) {
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
  }, utf8ToUincode: function (s) {
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
  }, json2str: function (obj) {
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
  }, time33: function (str) {
    var hash = 0;
    for (var i = 0, length = str.length; i < length; i++) {
      hash = hash * 33 + str.charCodeAt(i)
    }
    return hash % 4294967296
  }}
})();
$.css = function () {
  var A = document.documentElement;
  return{getPageScrollTop: function () {
    return window.pageYOffset || A.scrollTop || document.body.scrollTop || 0
  }, getPageScrollLeft: function () {
    return window.pageXOffset || A.scrollLeft || document.body.scrollLeft || 0
  }, getOffsetPosition: function (C) {
    C = $(C);
    var E = 0, D = 0;
    if (A.getBoundingClientRect && C.getBoundingClientRect) {
      var B = C.getBoundingClientRect();
      var G = A.clientTop || document.body.clientTop || 0;
      var F = A.clientLeft || document.body.clientLeft || 0;
      E = B.top + this.getPageScrollTop() - G, D = B.left + this.getPageScrollLeft() - F
    } else {
      do {
        E += C.offsetTop || 0;
        D += C.offsetLeft || 0;
        C = C.offsetParent
      } while (C)
    }
    return{left: D, top: E}
  }, getWidth: function (B) {
    return $(B).offsetWidth
  }, getHeight: function (B) {
    return $(B).offsetHeight
  }, show: function (B) {
    B.style.display = "block"
  }, hide: function (B) {
    B.style.display = "none"
  }, hasClass: function (E, F) {
    if (!E.className) {
      return false
    }
    var C = E.className.split(" ");
    for (var D = 0, B = C.length; D < B; D++) {
      if (F == C[D]) {
        return true
      }
    }
    return false
  }, addClass: function (B, C) {
    $.css.updateClass(B, C, false)
  }, removeClass: function (B, C) {
    $.css.updateClass(B, false, C)
  }, updateClass: function (E, J, L) {
    var B = E.className.split(" ");
    var H = {}, F = 0, I = B.length;
    for (; F < I; F++) {
      B[F] && (H[B[F]] = true)
    }
    if (J) {
      var G = J.split(" ");
      for (F = 0, I = G.length; F < I; F++) {
        G[F] && (H[G[F]] = true)
      }
    }
    if (L) {
      var C = L.split(" ");
      for (F = 0, I = C.length; F < I; F++) {
        C[F] && (delete H[C[F]])
      }
    }
    var K = [];
    for (var D in H) {
      K.push(D)
    }
    E.className = K.join(" ")
  }, setClass: function (C, B) {
    C.className = B
  }}
}();
$.animate = {fade: function (D, H, B, E, L) {
  D = $(D);
  if (!D) {
    return
  }
  if (!D.effect) {
    D.effect = {}
  }
  var F = Object.prototype.toString.call(H);
  var C = 100;
  if (!isNaN(H)) {
    C = H
  } else {
    if (F == "[object Object]") {
      if (H) {
        if (H.to) {
          if (!isNaN(H.to)) {
            C = H.to
          }
          if (!isNaN(H.from)) {
            D.style.opacity = H.from / 100;
            D.style.filter = "alpha(opacity=" + H.from + ")"
          }
        }
      }
    }
  }
  if (typeof (D.effect.fade) == "undefined") {
    D.effect.fade = 0
  }
  window.clearInterval(D.effect.fade);
  var B = B || 1, E = E || 20, G = window.navigator.userAgent.toLowerCase(), K = function (M) {
    var O;
    if (G.indexOf("msie") != -1) {
      var N = (M.currentStyle || {}).filter || "";
      O = N.indexOf("opacity") >= 0 ? (parseFloat(N.match(/opacity=([^)]*)/)[1])) + "" : "100"
    } else {
      var P = M.ownerDocument.defaultView;
      P = P && P.getComputedStyle;
      O = 100 * (P && P(M, null)["opacity"] || 1)
    }
    return parseFloat(O)
  }, A = K(D), I = A < C ? 1 : -1;
  if (G.indexOf("msie") != -1) {
    if (E < 15) {
      B = Math.floor((B * 15) / E);
      E = 15
    }
  }
  var J = function () {
    A = A + B * I;
    if ((Math.round(A) - C) * I >= 0) {
      D.style.opacity = C / 100;
      D.style.filter = "alpha(opacity=" + C + ")";
      window.clearInterval(D.effect.fade);
      if (typeof (L) == "function") {
        L(D)
      }
    } else {
      D.style.opacity = A / 100;
      D.style.filter = "alpha(opacity=" + A + ")"
    }
  };
  D.effect.fade = window.setInterval(J, E)
}, animate: function (B, C, H, R, G) {
  B = $(B);
  if (!B) {
    return
  }
  if (!B.effect) {
    B.effect = {}
  }
  if (typeof (B.effect.animate) == "undefined") {
    B.effect.animate = 0
  }
  for (var M in C) {
    C[M] = parseInt(C[M]) || 0
  }
  window.clearInterval(B.effect.animate);
  var H = H || 10, R = R || 20, I = function (V) {
    var U = {left: V.offsetLeft, top: V.offsetTop};
    return U
  }, T = I(B), F = {width: B.clientWidth, height: B.clientHeight, left: T.left, top: T.top}, D = [], Q = window.navigator.userAgent.toLowerCase();
  if (!(Q.indexOf("msie") != -1 && document.compatMode == "BackCompat")) {
    var K = document.defaultView ? document.defaultView.getComputedStyle(B, null) : B.currentStyle;
    var E = C.width || C.width == 0 ? parseInt(C.width) : null, S = C.height || C.height == 0 ? parseInt(C.height) : null;
    if (typeof (E) == "number") {
      D.push("width");
      C.width = E - K.paddingLeft.replace(/\D/g, "") - K.paddingRight.replace(/\D/g, "")
    }
    if (typeof (S) == "number") {
      D.push("height");
      C.height = S - K.paddingTop.replace(/\D/g, "") - K.paddingBottom.replace(/\D/g, "")
    }
    if (R < 15) {
      H = Math.floor((H * 15) / R);
      R = 15
    }
  }
  var P = C.left || C.left == 0 ? parseInt(C.left) : null, L = C.top || C.top == 0 ? parseInt(C.top) : null;
  if (typeof (P) == "number") {
    D.push("left");
    B.style.position = "absolute"
  }
  if (typeof (L) == "number") {
    D.push("top");
    B.style.position = "absolute"
  }
  var J = [], O = D.length;
  for (var M = 0; M < O; M++) {
    J[D[M]] = F[D[M]] < C[D[M]] ? 1 : -1
  }
  var N = B.style;
  var A = function () {
    var U = true;
    for (var V = 0; V < O; V++) {
      F[D[V]] = F[D[V]] + J[D[V]] * Math.abs(C[D[V]] - F[D[V]]) * H / 100;
      if ((Math.round(F[D[V]]) - C[D[V]]) * J[D[V]] >= 0) {
        U = U && true;
        N[D[V]] = C[D[V]] + "px"
      } else {
        U = U && false;
        N[D[V]] = F[D[V]] + "px"
      }
    }
    if (U) {
      window.clearInterval(B.effect.animate);
      if (typeof (G) == "function") {
        G(B)
      }
    }
  };
  B.effect.animate = window.setInterval(A, R)
}};
$.check = {isHttps: function () {
  return document.location.protocol == "https:"
}, isSsl: function () {
  var A = document.location.host;
  return/^ssl./i.test(A)
}, isIpad: function () {
  var A = navigator.userAgent.toLowerCase();
  return/ipad/i.test(A)
}, isQQ: function (A) {
  return/^[1-9]{1}\d{4,9}$/.test(A)
}, isQQMail: function (A) {
  return/^[1-9]{1}\d{4,9}@qq\.com$/.test(A)
}, isNullQQ: function (A) {
  return/^\d{1,4}$/.test(A)
}, isNick: function (A) {
  return/^[a-zA-Z]{1}([a-zA-Z0-9]|[-_]){0,19}$/.test(A)
}, isName: function (A) {
  return/[\u4E00-\u9FA5]{1,8}/.test(A)
}, isPhone: function (A) {
  return/^(?:86|886|)1\d{10}\s*$/.test(A)
}, isDXPhone: function (A) {
  return/^(?:86|886|)1(?:33|53|80|81|89)\d{8}$/.test(A)
}, isSeaPhone: function (A) {
  return/^(00)?(?:852|853|886(0)?\d{1})\d{8}$/.test(A)
}, isMail: function (A) {
  return/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(A)
}, isQiyeQQ800: function (A) {
  return/^(800)\d{7}$/.test(A)
}, isPassword: function (A) {
  return A && A.length >= 16
}, isForeignPhone: function (A) {
  return/^00\d{7,}/.test(A)
}, needVip: function (E) {
  var A = ["21001601", "21000110", "21000121", "46000101", "716027609", "716027610", "549000912"];
  var B = true;
  for (var C = 0, D = A.length; C < D; C++) {
    if (A[C] == E) {
      B = false;
      break
    }
  }
  return B
}, isPaipai: function () {
  return/paipai.com$/.test(window.location.hostname)
}, is_weibo_appid: function (A) {
  if (A == 46000101 || A == 607000101 || A == 558032501) {
    return true
  }
  return false
}};
$.report = {monitor: function (C, B) {
  if (Math.random() > (B || 1)) {
    return
  }
  var A = location.protocol + "//ui.ptlogin2.qq.com/cgi-bin/report?id=" + C;
  $.http.preload(A)
}, nlog: function (E, B) {
  var A = "http://badjs.qq.com/cgi-bin/js_report?";
  if ($.check.isHttps()) {
    A = "https://ssl.qq.com//badjs/cgi-bin/js_report?"
  }
  var C = location.href;
  var D = encodeURIComponent(E + "|_|" + C + "|_|" + window.navigator.userAgent);
  A += ("bid=110&level=2&mid=" + B + "&msg=" + D + "&v=" + Math.random());
  $.http.preload(A)
}, simpleIsdSpeed: function (A, C) {
  if (Math.random() < (C || 1)) {
    var B = "http://isdspeed.qq.com/cgi-bin/r.cgi?";
    if ($.check.isHttps()) {
      B = "https://login.qq.com/cgi-bin/r.cgi?"
    }
    B += A;
    $.http.preload(B)
  }
}, isdSpeed: function (A, F) {
  var B = false;
  var D = "http://isdspeed.qq.com/cgi-bin/r.cgi?";
  if ($.check.isHttps()) {
    D = "https://login.qq.com/cgi-bin/r.cgi?"
  }
  D += A;
  if (Math.random() < (F || 1)) {
    var C = $.report.getSpeedPoints(A);
    for (var E in C) {
      if (C[E] && C[E] < 30000) {
        D += ("&" + E + "=" + C[E]);
        B = true
      }
    }
    D += "&v=" + Math.random();
    if (B) {
      $.http.preload(D)
    }
  }
  $.report.setSpeedPoint(A)
}, speedPoints: {}, basePoint: {}, setBasePoint: function (A, B) {
  $.report.basePoint[A] = B
}, setSpeedPoint: function (A, B, C) {
  if (!B) {
    $.report.speedPoints[A] = {}
  } else {
    if (!$.report.speedPoints[A]) {
      $.report.speedPoints[A] = {}
    }
    $.report.speedPoints[A][B] = C - $.report.basePoint[A]
  }
}, setSpeedPoints: function (A, B) {
  $.report.speedPoints[A] = B
}, getSpeedPoints: function (A) {
  return $.report.speedPoints[A]
}};
$.sso_ver = 0;
$.sso_state = 0;
$.plugin_isd_flag = "";
$.nptxsso = null;
$.activetxsso = null;
$.sso_loadComplete = true;
$.np_clock = 0;
$.loginQQnum = 0;
$.suportActive = function () {
  var A = true;
  try {
    if (window.ActiveXObject || window.ActiveXObject.prototype) {
      A = true;
      if (window.ActiveXObject.prototype && !window.ActiveXObject) {
        $.report.nlog("activeobject å¤æ­æé®é¢")
      }
    } else {
      A = false
    }
  } catch (B) {
    A = false
  }
  return A
};
$.getLoginQQNum = function () {
  try {
    var E = 0;
    if ($.suportActive()) {
      $.plugin_isd_flag = "flag1=7808&flag2=1&flag3=20";
      $.report.setBasePoint($.plugin_isd_flag, new Date());
      var J = new ActiveXObject("SSOAxCtrlForPTLogin.SSOForPTLogin2");
      $.activetxsso = J;
      var B = J.CreateTXSSOData();
      J.InitSSOFPTCtrl(0, B);
      var A = J.DoOperation(2, B);
      var D = A.GetArray("PTALIST");
      E = D.GetSize();
      try {
        var C = J.QuerySSOInfo(1);
        $.sso_ver = C.GetInt("nSSOVersion")
      } catch (F) {
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
          $.report.nlog("æ²¡ææ¾å°æä»¶çInitPVANoSTæ¹æ³", 269929)
        } else {
          var H = $.nptxsso.InitPVANoST();
          if (H) {
            E = $.nptxsso.GetPVACount();
            $.sso_loadComplete = true
          }
          try {
            $.sso_ver = $.nptxsso.GetSSOVersion()
          } catch (F) {
            $.sso_ver = 0
          }
        }
      } else {
        $.report.nlog("æä»¶æ²¡ææ³¨åæå", 263744);
        $.sso_state = 2
      }
    }
  } catch (F) {
    var I = null;
    try {
      I = $.http.getXHR()
    } catch (F) {
      return 0
    }
    var G = F.message || F;
    if (/^pt_windows_sso/.test(G)) {
      if (/^pt_windows_sso_\d+_3/.test(G)) {
        $.report.nlog("QQæä»¶ä¸æ¯æè¯¥url" + F.message, 326044)
      } else {
        $.report.nlog("QQæä»¶æåºåé¨éè¯¯" + F.message, 325361)
      }
      $.sso_state = 1
    } else {
      if (I) {
        $.report.nlog("å¯è½æ²¡æå®è£QQ" + F.message, 322340);
        $.sso_state = 2
      } else {
        $.report.nlog("è·åç»å½QQå·ç åºé" + F.message, 263745);
        if (window.ActiveXObject) {
          $.sso_state = 1
        }
      }
    }
    return 0
  }
  $.loginQQnum = E;
  return E
};
$.checkNPPlugin = function () {
  var A = 10;
  window.clearInterval($.np_clock);
  $.np_clock = window.setInterval(function () {
    if (typeof $.nptxsso.InitPVANoST == "function" || A == 0) {
      window.clearInterval($.np_clock);
      if (typeof $.nptxsso.InitPVANoST == "function") {
        pt.plogin.auth()
      }
    } else {
      A--
    }
  }, 200)
};
$.guanjiaPlugin = null;
$.initGuanjiaPlugin = function () {
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
    var A = $.guanjiaPlugin.QMGetVersion().split(".");
    if (A.length == 4 && A[2] >= 9319) {
    } else {
      $.guanjiaPlugin = null
    }
  } catch (B) {
    $.guanjiaPlugin = null
  }
};
function pluginBegin() {
  if (!$.sso_loadComplete) {
    try {
      $.checkNPPlugin()
    } catch (A) {
    }
  }
  $.sso_loadComplete = true;
  $.report.setSpeedPoint($.plugin_isd_flag, 1, (new Date()).getTime());
  window.setTimeout(function (B) {
    $.report.isdSpeed($.plugin_isd_flag, 0.05)
  }, 2000)
}
(function () {
  var A = "nohost_guid";
  var B = "/nohost_htdocs/js/SwitchHost.js";
  if ($.cookie.get(A) != "") {
    $.http.loadScript(B, function () {
      var C = window.SwitchHost && window.SwitchHost.init;
      C && C()
    })
  }
})();
$.RSA = function () {
  function G(z, t) {
    return new AT(z, t)
  }

  function AJ(Ab, Ac) {
    var t = "";
    var z = 0;
    while (z + Ac < Ab.length) {
      t += Ab.substring(z, z + Ac) + "\n";
      z += Ac
    }
    return t + Ab.substring(z, Ab.length)
  }

  function R(t) {
    if (t < 16) {
      return"0" + t.toString(16)
    } else {
      return t.toString(16)
    }
  }

  function AH(Ac, Af) {
    if (Af < Ac.length + 11) {
      uv_alert("Message too long for RSA");
      return null
    }
    var Ae = new Array();
    var Ab = Ac.length - 1;
    while (Ab >= 0 && Af > 0) {
      var Ad = Ac.charCodeAt(Ab--);
      if (Ad < 128) {
        Ae[--Af] = Ad
      } else {
        if ((Ad > 127) && (Ad < 2048)) {
          Ae[--Af] = (Ad & 63) | 128;
          Ae[--Af] = (Ad >> 6) | 192
        } else {
          Ae[--Af] = (Ad & 63) | 128;
          Ae[--Af] = ((Ad >> 6) & 63) | 128;
          Ae[--Af] = (Ad >> 12) | 224
        }
      }
    }
    Ae[--Af] = 0;
    var z = new AF();
    var t = new Array();
    while (Af > 2) {
      t[0] = 0;
      while (t[0] == 0) {
        z.nextBytes(t)
      }
      Ae[--Af] = t[0]
    }
    Ae[--Af] = 2;
    Ae[--Af] = 0;
    return new AT(Ae)
  }

  function l() {
    this.n = null;
    this.e = 0;
    this.d = null;
    this.p = null;
    this.q = null;
    this.dmp1 = null;
    this.dmq1 = null;
    this.coeff = null
  }

  function O(z, t) {
    if (z != null && t != null && z.length > 0 && t.length > 0) {
      this.n = G(z, 16);
      this.e = parseInt(t, 16)
    } else {
      uv_alert("Invalid RSA public key")
    }
  }

  function x(t) {
    return t.modPowInt(this.e, this.n)
  }

  function P(Ab) {
    var t = AH(Ab, (this.n.bitLength() + 7) >> 3);
    if (t == null) {
      return null
    }
    var Ac = this.doPublic(t);
    if (Ac == null) {
      return null
    }
    var z = Ac.toString(16);
    if ((z.length & 1) == 0) {
      return z
    } else {
      return"0" + z
    }
  }

  l.prototype.doPublic = x;
  l.prototype.setPublic = O;
  l.prototype.encrypt = P;
  var AX;
  var AK = 244837814094590;
  var AB = ((AK & 16777215) == 15715070);

  function AT(z, t, Ab) {
    if (z != null) {
      if ("number" == typeof z) {
        this.fromNumber(z, t, Ab)
      } else {
        if (t == null && "string" != typeof z) {
          this.fromString(z, 256)
        } else {
          this.fromString(z, t)
        }
      }
    }
  }

  function H() {
    return new AT(null)
  }

  function B(Ad, t, z, Ac, Af, Ae) {
    while (--Ae >= 0) {
      var Ab = t * this[Ad++] + z[Ac] + Af;
      Af = Math.floor(Ab / 67108864);
      z[Ac++] = Ab & 67108863
    }
    return Af
  }

  function AZ(Ad, Ai, Aj, Ac, Ag, t) {
    var Af = Ai & 32767, Ah = Ai >> 15;
    while (--t >= 0) {
      var Ab = this[Ad] & 32767;
      var Ae = this[Ad++] >> 15;
      var z = Ah * Ab + Ae * Af;
      Ab = Af * Ab + ((z & 32767) << 15) + Aj[Ac] + (Ag & 1073741823);
      Ag = (Ab >>> 30) + (z >>> 15) + Ah * Ae + (Ag >>> 30);
      Aj[Ac++] = Ab & 1073741823
    }
    return Ag
  }

  function AY(Ad, Ai, Aj, Ac, Ag, t) {
    var Af = Ai & 16383, Ah = Ai >> 14;
    while (--t >= 0) {
      var Ab = this[Ad] & 16383;
      var Ae = this[Ad++] >> 14;
      var z = Ah * Ab + Ae * Af;
      Ab = Af * Ab + ((z & 16383) << 14) + Aj[Ac] + Ag;
      Ag = (Ab >> 28) + (z >> 14) + Ah * Ae;
      Aj[Ac++] = Ab & 268435455
    }
    return Ag
  }

  if (AB && (navigator.appName == "Microsoft Internet Explorer")) {
    AT.prototype.am = AZ;
    AX = 30
  } else {
    if (AB && (navigator.appName != "Netscape")) {
      AT.prototype.am = B;
      AX = 26
    } else {
      AT.prototype.am = AY;
      AX = 28
    }
  }
  AT.prototype.DB = AX;
  AT.prototype.DM = ((1 << AX) - 1);
  AT.prototype.DV = (1 << AX);
  var AC = 52;
  AT.prototype.FV = Math.pow(2, AC);
  AT.prototype.F1 = AC - AX;
  AT.prototype.F2 = 2 * AX - AC;
  var AG = "0123456789abcdefghijklmnopqrstuvwxyz";
  var AI = new Array();
  var AR, U;
  AR = "0".charCodeAt(0);
  for (U = 0; U <= 9; ++U) {
    AI[AR++] = U
  }
  AR = "a".charCodeAt(0);
  for (U = 10; U < 36; ++U) {
    AI[AR++] = U
  }
  AR = "A".charCodeAt(0);
  for (U = 10; U < 36; ++U) {
    AI[AR++] = U
  }
  function Aa(t) {
    return AG.charAt(t)
  }

  function Y(z, t) {
    var Ab = AI[z.charCodeAt(t)];
    return(Ab == null) ? -1 : Ab
  }

  function AA(z) {
    for (var t = this.t - 1; t >= 0; --t) {
      z[t] = this[t]
    }
    z.t = this.t;
    z.s = this.s
  }

  function N(t) {
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

  function C(t) {
    var z = H();
    z.fromInt(t);
    return z
  }

  function V(Af, z) {
    var Ac;
    if (z == 16) {
      Ac = 4
    } else {
      if (z == 8) {
        Ac = 3
      } else {
        if (z == 256) {
          Ac = 8
        } else {
          if (z == 2) {
            Ac = 1
          } else {
            if (z == 32) {
              Ac = 5
            } else {
              if (z == 4) {
                Ac = 2
              } else {
                this.fromRadix(Af, z);
                return
              }
            }
          }
        }
      }
    }
    this.t = 0;
    this.s = 0;
    var Ae = Af.length, Ab = false, Ad = 0;
    while (--Ae >= 0) {
      var t = (Ac == 8) ? Af[Ae] & 255 : Y(Af, Ae);
      if (t < 0) {
        if (Af.charAt(Ae) == "-") {
          Ab = true
        }
        continue
      }
      Ab = false;
      if (Ad == 0) {
        this[this.t++] = t
      } else {
        if (Ad + Ac > this.DB) {
          this[this.t - 1] |= (t & ((1 << (this.DB - Ad)) - 1)) << Ad;
          this[this.t++] = (t >> (this.DB - Ad))
        } else {
          this[this.t - 1] |= t << Ad
        }
      }
      Ad += Ac;
      if (Ad >= this.DB) {
        Ad -= this.DB
      }
    }
    if (Ac == 8 && (Af[0] & 128) != 0) {
      this.s = -1;
      if (Ad > 0) {
        this[this.t - 1] |= ((1 << (this.DB - Ad)) - 1) << Ad
      }
    }
    this.clamp();
    if (Ab) {
      AT.ZERO.subTo(this, this)
    }
  }

  function o() {
    var t = this.s & this.DM;
    while (this.t > 0 && this[this.t - 1] == t) {
      --this.t
    }
  }

  function Q(z) {
    if (this.s < 0) {
      return"-" + this.negate().toString(z)
    }
    var Ab;
    if (z == 16) {
      Ab = 4
    } else {
      if (z == 8) {
        Ab = 3
      } else {
        if (z == 2) {
          Ab = 1
        } else {
          if (z == 32) {
            Ab = 5
          } else {
            if (z == 4) {
              Ab = 2
            } else {
              return this.toRadix(z)
            }
          }
        }
      }
    }
    var Ad = (1 << Ab) - 1, Ag, t = false, Ae = "", Ac = this.t;
    var Af = this.DB - (Ac * this.DB) % Ab;
    if (Ac-- > 0) {
      if (Af < this.DB && (Ag = this[Ac] >> Af) > 0) {
        t = true;
        Ae = Aa(Ag)
      }
      while (Ac >= 0) {
        if (Af < Ab) {
          Ag = (this[Ac] & ((1 << Af) - 1)) << (Ab - Af);
          Ag |= this[--Ac] >> (Af += this.DB - Ab)
        } else {
          Ag = (this[Ac] >> (Af -= Ab)) & Ad;
          if (Af <= 0) {
            Af += this.DB;
            --Ac
          }
        }
        if (Ag > 0) {
          t = true
        }
        if (t) {
          Ae += Aa(Ag)
        }
      }
    }
    return t ? Ae : "0"
  }

  function r() {
    var t = H();
    AT.ZERO.subTo(this, t);
    return t
  }

  function AN() {
    return(this.s < 0) ? this.negate() : this
  }

  function f(t) {
    var Ab = this.s - t.s;
    if (Ab != 0) {
      return Ab
    }
    var z = this.t;
    Ab = z - t.t;
    if (Ab != 0) {
      return Ab
    }
    while (--z >= 0) {
      if ((Ab = this[z] - t[z]) != 0) {
        return Ab
      }
    }
    return 0
  }

  function J(z) {
    var Ac = 1, Ab;
    if ((Ab = z >>> 16) != 0) {
      z = Ab;
      Ac += 16
    }
    if ((Ab = z >> 8) != 0) {
      z = Ab;
      Ac += 8
    }
    if ((Ab = z >> 4) != 0) {
      z = Ab;
      Ac += 4
    }
    if ((Ab = z >> 2) != 0) {
      z = Ab;
      Ac += 2
    }
    if ((Ab = z >> 1) != 0) {
      z = Ab;
      Ac += 1
    }
    return Ac
  }

  function T() {
    if (this.t <= 0) {
      return 0
    }
    return this.DB * (this.t - 1) + J(this[this.t - 1] ^ (this.s & this.DM))
  }

  function AS(Ab, z) {
    var t;
    for (t = this.t - 1; t >= 0; --t) {
      z[t + Ab] = this[t]
    }
    for (t = Ab - 1; t >= 0; --t) {
      z[t] = 0
    }
    z.t = this.t + Ab;
    z.s = this.s
  }

  function y(Ab, z) {
    for (var t = Ab; t < this.t; ++t) {
      z[t - Ab] = this[t]
    }
    z.t = Math.max(this.t - Ab, 0);
    z.s = this.s
  }

  function S(Ag, Ac) {
    var z = Ag % this.DB;
    var t = this.DB - z;
    var Ae = (1 << t) - 1;
    var Ad = Math.floor(Ag / this.DB), Af = (this.s << z) & this.DM, Ab;
    for (Ab = this.t - 1; Ab >= 0; --Ab) {
      Ac[Ab + Ad + 1] = (this[Ab] >> t) | Af;
      Af = (this[Ab] & Ae) << z
    }
    for (Ab = Ad - 1; Ab >= 0; --Ab) {
      Ac[Ab] = 0
    }
    Ac[Ad] = Af;
    Ac.t = this.t + Ad + 1;
    Ac.s = this.s;
    Ac.clamp()
  }

  function L(Af, Ac) {
    Ac.s = this.s;
    var Ad = Math.floor(Af / this.DB);
    if (Ad >= this.t) {
      Ac.t = 0;
      return
    }
    var z = Af % this.DB;
    var t = this.DB - z;
    var Ae = (1 << z) - 1;
    Ac[0] = this[Ad] >> z;
    for (var Ab = Ad + 1; Ab < this.t; ++Ab) {
      Ac[Ab - Ad - 1] |= (this[Ab] & Ae) << t;
      Ac[Ab - Ad] = this[Ab] >> z
    }
    if (z > 0) {
      Ac[this.t - Ad - 1] |= (this.s & Ae) << t
    }
    Ac.t = this.t - Ad;
    Ac.clamp()
  }

  function AD(z, Ac) {
    var Ab = 0, Ad = 0, t = Math.min(z.t, this.t);
    while (Ab < t) {
      Ad += this[Ab] - z[Ab];
      Ac[Ab++] = Ad & this.DM;
      Ad >>= this.DB
    }
    if (z.t < this.t) {
      Ad -= z.s;
      while (Ab < this.t) {
        Ad += this[Ab];
        Ac[Ab++] = Ad & this.DM;
        Ad >>= this.DB
      }
      Ad += this.s
    } else {
      Ad += this.s;
      while (Ab < z.t) {
        Ad -= z[Ab];
        Ac[Ab++] = Ad & this.DM;
        Ad >>= this.DB
      }
      Ad -= z.s
    }
    Ac.s = (Ad < 0) ? -1 : 0;
    if (Ad < -1) {
      Ac[Ab++] = this.DV + Ad
    } else {
      if (Ad > 0) {
        Ac[Ab++] = Ad
      }
    }
    Ac.t = Ab;
    Ac.clamp()
  }

  function b(z, Ac) {
    var t = this.abs(), Ad = z.abs();
    var Ab = t.t;
    Ac.t = Ab + Ad.t;
    while (--Ab >= 0) {
      Ac[Ab] = 0
    }
    for (Ab = 0; Ab < Ad.t; ++Ab) {
      Ac[Ab + t.t] = t.am(0, Ad[Ab], Ac, Ab, 0, t.t)
    }
    Ac.s = 0;
    Ac.clamp();
    if (this.s != z.s) {
      AT.ZERO.subTo(Ac, Ac)
    }
  }

  function q(Ab) {
    var t = this.abs();
    var z = Ab.t = 2 * t.t;
    while (--z >= 0) {
      Ab[z] = 0
    }
    for (z = 0; z < t.t - 1; ++z) {
      var Ac = t.am(z, t[z], Ab, 2 * z, 0, 1);
      if ((Ab[z + t.t] += t.am(z + 1, 2 * t[z], Ab, 2 * z + 1, Ac, t.t - z - 1)) >= t.DV) {
        Ab[z + t.t] -= t.DV;
        Ab[z + t.t + 1] = 1
      }
    }
    if (Ab.t > 0) {
      Ab[Ab.t - 1] += t.am(z, t[z], Ab, 2 * z, 0, 1)
    }
    Ab.s = 0;
    Ab.clamp()
  }

  function c(Aj, Ag, Af) {
    var Ap = Aj.abs();
    if (Ap.t <= 0) {
      return
    }
    var Ah = this.abs();
    if (Ah.t < Ap.t) {
      if (Ag != null) {
        Ag.fromInt(0)
      }
      if (Af != null) {
        this.copyTo(Af)
      }
      return
    }
    if (Af == null) {
      Af = H()
    }
    var Ad = H(), z = this.s, Ai = Aj.s;
    var Ao = this.DB - J(Ap[Ap.t - 1]);
    if (Ao > 0) {
      Ap.lShiftTo(Ao, Ad);
      Ah.lShiftTo(Ao, Af)
    } else {
      Ap.copyTo(Ad);
      Ah.copyTo(Af)
    }
    var Al = Ad.t;
    var Ab = Ad[Al - 1];
    if (Ab == 0) {
      return
    }
    var Ak = Ab * (1 << this.F1) + ((Al > 1) ? Ad[Al - 2] >> this.F2 : 0);
    var As = this.FV / Ak, Ar = (1 << this.F1) / Ak, Aq = 1 << this.F2;
    var An = Af.t, Am = An - Al, Ae = (Ag == null) ? H() : Ag;
    Ad.dlShiftTo(Am, Ae);
    if (Af.compareTo(Ae) >= 0) {
      Af[Af.t++] = 1;
      Af.subTo(Ae, Af)
    }
    AT.ONE.dlShiftTo(Al, Ae);
    Ae.subTo(Ad, Ad);
    while (Ad.t < Al) {
      Ad[Ad.t++] = 0
    }
    while (--Am >= 0) {
      var Ac = (Af[--An] == Ab) ? this.DM : Math.floor(Af[An] * As + (Af[An - 1] + Aq) * Ar);
      if ((Af[An] += Ad.am(0, Ac, Af, Am, 0, Al)) < Ac) {
        Ad.dlShiftTo(Am, Ae);
        Af.subTo(Ae, Af);
        while (Af[An] < --Ac) {
          Af.subTo(Ae, Af)
        }
      }
    }
    if (Ag != null) {
      Af.drShiftTo(Al, Ag);
      if (z != Ai) {
        AT.ZERO.subTo(Ag, Ag)
      }
    }
    Af.t = Al;
    Af.clamp();
    if (Ao > 0) {
      Af.rShiftTo(Ao, Af)
    }
    if (z < 0) {
      AT.ZERO.subTo(Af, Af)
    }
  }

  function n(t) {
    var z = H();
    this.abs().divRemTo(t, null, z);
    if (this.s < 0 && z.compareTo(AT.ZERO) > 0) {
      t.subTo(z, z)
    }
    return z
  }

  function k(t) {
    this.m = t
  }

  function w(t) {
    if (t.s < 0 || t.compareTo(this.m) >= 0) {
      return t.mod(this.m)
    } else {
      return t
    }
  }

  function AM(t) {
    return t
  }

  function j(t) {
    t.divRemTo(this.m, null, t)
  }

  function g(t, Ab, z) {
    t.multiplyTo(Ab, z);
    this.reduce(z)
  }

  function AV(t, z) {
    t.squareTo(z);
    this.reduce(z)
  }

  k.prototype.convert = w;
  k.prototype.revert = AM;
  k.prototype.reduce = j;
  k.prototype.mulTo = g;
  k.prototype.sqrTo = AV;
  function Z() {
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
    return(z > 0) ? this.DV - z : -z
  }

  function F(t) {
    this.m = t;
    this.mp = t.invDigit();
    this.mpl = this.mp & 32767;
    this.mph = this.mp >> 15;
    this.um = (1 << (t.DB - 15)) - 1;
    this.mt2 = 2 * t.t
  }

  function AL(t) {
    var z = H();
    t.abs().dlShiftTo(this.m.t, z);
    z.divRemTo(this.m, null, z);
    if (t.s < 0 && z.compareTo(AT.ZERO) > 0) {
      this.m.subTo(z, z)
    }
    return z
  }

  function AU(t) {
    var z = H();
    t.copyTo(z);
    this.reduce(z);
    return z
  }

  function p(t) {
    while (t.t <= this.mt2) {
      t[t.t++] = 0
    }
    for (var Ab = 0; Ab < this.m.t; ++Ab) {
      var z = t[Ab] & 32767;
      var Ac = (z * this.mpl + (((z * this.mph + (t[Ab] >> 15) * this.mpl) & this.um) << 15)) & t.DM;
      z = Ab + this.m.t;
      t[z] += this.m.am(0, Ac, t, Ab, 0, this.m.t);
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

  function AO(t, z) {
    t.squareTo(z);
    this.reduce(z)
  }

  function X(t, Ab, z) {
    t.multiplyTo(Ab, z);
    this.reduce(z)
  }

  F.prototype.convert = AL;
  F.prototype.revert = AU;
  F.prototype.reduce = p;
  F.prototype.mulTo = X;
  F.prototype.sqrTo = AO;
  function I() {
    return((this.t > 0) ? (this[0] & 1) : this.s) == 0
  }

  function W(Ag, Ah) {
    if (Ag > 4294967295 || Ag < 1) {
      return AT.ONE
    }
    var Af = H(), Ab = H(), Ae = Ah.convert(this), Ad = J(Ag) - 1;
    Ae.copyTo(Af);
    while (--Ad >= 0) {
      Ah.sqrTo(Af, Ab);
      if ((Ag & (1 << Ad)) > 0) {
        Ah.mulTo(Ab, Ae, Af)
      } else {
        var Ac = Af;
        Af = Ab;
        Ab = Ac
      }
    }
    return Ah.revert(Af)
  }

  function AP(Ab, t) {
    var Ac;
    if (Ab < 256 || t.isEven()) {
      Ac = new k(t)
    } else {
      Ac = new F(t)
    }
    return this.exp(Ab, Ac)
  }

  AT.prototype.copyTo = AA;
  AT.prototype.fromInt = N;
  AT.prototype.fromString = V;
  AT.prototype.clamp = o;
  AT.prototype.dlShiftTo = AS;
  AT.prototype.drShiftTo = y;
  AT.prototype.lShiftTo = S;
  AT.prototype.rShiftTo = L;
  AT.prototype.subTo = AD;
  AT.prototype.multiplyTo = b;
  AT.prototype.squareTo = q;
  AT.prototype.divRemTo = c;
  AT.prototype.invDigit = Z;
  AT.prototype.isEven = I;
  AT.prototype.exp = W;
  AT.prototype.toString = Q;
  AT.prototype.negate = r;
  AT.prototype.abs = AN;
  AT.prototype.compareTo = f;
  AT.prototype.bitLength = T;
  AT.prototype.mod = n;
  AT.prototype.modPowInt = AP;
  AT.ZERO = C(0);
  AT.ONE = C(1);
  var M;
  var v;
  var AE;

  function D(t) {
    v[AE++] ^= t & 255;
    v[AE++] ^= (t >> 8) & 255;
    v[AE++] ^= (t >> 16) & 255;
    v[AE++] ^= (t >> 24) & 255;
    if (AE >= m) {
      AE -= m
    }
  }

  function u() {
    D(new Date().getTime())
  }

  if (v == null) {
    v = new Array();
    AE = 0;
    var h;
    if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto && window.crypto.random) {
      var d = window.crypto.random(32);
      for (h = 0; h < d.length; ++h) {
        v[AE++] = d.charCodeAt(h) & 255
      }
    }
    while (AE < m) {
      h = Math.floor(65536 * Math.random());
      v[AE++] = h >>> 8;
      v[AE++] = h & 255
    }
    AE = 0;
    u()
  }
  function a() {
    if (M == null) {
      u();
      M = AQ();
      M.init(v);
      for (AE = 0; AE < v.length; ++AE) {
        v[AE] = 0
      }
      AE = 0
    }
    return M.next()
  }

  function AW(z) {
    var t;
    for (t = 0; t < z.length; ++t) {
      z[t] = a()
    }
  }

  function AF() {
  }

  AF.prototype.nextBytes = AW;
  function K() {
    this.i = 0;
    this.j = 0;
    this.S = new Array()
  }

  function E(Ad) {
    var Ac, z, Ab;
    for (Ac = 0; Ac < 256; ++Ac) {
      this.S[Ac] = Ac
    }
    z = 0;
    for (Ac = 0; Ac < 256; ++Ac) {
      z = (z + this.S[Ac] + Ad[Ac % Ad.length]) & 255;
      Ab = this.S[Ac];
      this.S[Ac] = this.S[z];
      this.S[z] = Ab
    }
    this.i = 0;
    this.j = 0
  }

  function A() {
    var z;
    this.i = (this.i + 1) & 255;
    this.j = (this.j + this.S[this.i]) & 255;
    z = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = z;
    return this.S[(z + this.S[this.i]) & 255]
  }

  K.prototype.init = E;
  K.prototype.next = A;
  function AQ() {
    return new K()
  }

  var m = 256;

  function s(Ac, Ab, z) {
    Ab = "DF29C573C20C0B3D46F7C214B6ADB6DF55326ABFD6B4C182462446A2F6C103B80568B50019F0998D4680B0ADCA51FF916DBA64ED1004FCAE5B05A1D2EA8E986A6E0E4A153D4E0F231D9672407DC859AF8C403B938077AA736E115C2D5D7282FBC2D15CA6CE2EBE2B20EA44B45BCDA05B37D0A41EE590C0F17936E02235B8DB31";
    z = "3";
    var t = new l();
    t.setPublic(Ab, z);
    return t.encrypt(Ac)
  }

  return{rsa_encrypt: s}
}();
$.Encryption = function () {
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
    return(msw << 16) | (lsw & 65535)
  }

  function bit_rol(num, cnt) {
    return(num << cnt) | (num >>> (32 - cnt))
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

  return{getEncryption: getEncryption, getRSAEncryption: getRSAEncryption}
}();
pt.setHeader = function (A) {
  for (var B in A) {
    if (B != "") {
      if ($("img_" + B)) {
        if (A[B] && A[B].indexOf("sys.getface.qq.com") > -1) {
          $("img_" + B).src = pt.plogin.dftImg
        } else {
          $("img_" + B).src = A[B] || pt.plogin.dftImg
        }
      } else {
        if (A[B] && A[B].indexOf("sys.getface.qq.com") > -1) {
          $("auth_face").src = pt.plogin.dftImg
        } else {
          $("auth_face").src = A[B] || pt.plogin.dftImg
        }
      }
    }
  }
};
pt.qlogin = function () {
  var h = {"19": 3, "20": 2, "21": 3, "22": 3, "23": 3, "25": 3, "32": 3, "33": 3, "34": 3};
  var P = {"19": 300, "20": 240, "21": 360, "22": 360, "23": 300, "25": 300, "32": 360, "33": 300, "34": 300};
  var Y = [];
  var N = [];
  var Z = 9;
  var o = '<a hidefocus=true draggable=false href="javascript:void(0);" tabindex="#tabindex#" uin="#uin#" type="#type#" onclick="pt.qlogin.imgClick(this);return false;" onfocus="pt.qlogin.imgFocus(this);" onblur="pt.qlogin.imgBlur(this);" onmouseover="pt.qlogin.imgMouseover(this);" onmousedown="pt.qlogin.imgMouseDowm(this)" onmouseup="pt.qlogin.imgMouseUp(this)" onmouseout="pt.qlogin.imgMouseUp(this)" class="face"  >          <img  id="img_#uin#" uin="#uin#" type="#type#" src="#src#"    onerror="pt.qlogin.imgErr(this);" />           <span id="mengban_#uin#"></span>          <span class="uin_menban"></span>          <span class="uin">#uin#</span>          <span id="img_out_#uin#" uin="#uin#" type="#type#"  class="img_out"  ></span>          <span id="nick_#uin#" class="#nick_class#">#nick#</span>          <span  class="#vip_logo#"></span>      </a>';
  var R = '<span  uin="#uin#" type="#type#"  class="#qr_class#"  >          <span class="qr_safe_tips">å®å¨ç»å½ï¼é²æ­¢çå·</span>          <img   id="qrlogin_img" uin="#uin#" type="#type#" src="#src#" class="qrImg"  />           <span id="nick_#uin#"  class="qr_app_name">            <a class="qr_short_tips"  href="http://im.qq.com/mobileqq/#from=login" target="_blank">#nick#</a>            <span class="qr_safe_login">å®å¨ç»å½</span>            <a hidefocus=true draggable=false class="qr_info_link"  href="http://im.qq.com/mobileqq/#from=login" target="_blank">ä½¿ç¨QQææºçæ«æäºç»´ç </a>          </span>          <span  class="qrlogin_img_out"  onmouseover="pt.plogin.showQrTips();" onmouseout="pt.plogin.hideQrTips();"></span>          <span id="qr_invalid" class="qr_invalid" onclick="pt.plogin.begin_qrlogin();" onmouseover="pt.plogin.showQrTips();" onmouseout="pt.plogin.hideQrTips();">            <span id="qr_mengban" class="qr_mengban"></span>            <span id="qr_invalid_tips" class="qr_invalid_tips">äºç»´ç å¤±æ<br/>è¯·ç¹å»å·æ°</span>          </span>       </span>';
  var d = false;
  var J = 1;
  var W = h[pt.ptui.style];
  var T = P[pt.ptui.style];
  var Q = 1;
  var j = 5;
  var E = null;
  var g = true;
  var l = 0;
  var A = function (w) {
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
  var k = function () {
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
          var AC = {uin: AS, name: AU, uinString: AF, type: AE, face: AI, nick: AK, flag: AH, key: AD, loginType: 2};
          N.push(AC)
        }
      } catch (AR) {
        $.report.nlog("IEè·åå¿«éç»å½ä¿¡æ¯å¤±è´¥ï¼" + AR.message, "391626")
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
            var AC = {uin: s, name: t, uinString: AF, type: 0, face: AA, nick: AM, flag: AN, key: AJ, loginType: 2};
            N.push(AC)
          }
          if (typeof (r.GetKeyIndex) == "function") {
            Z = r.GetKeyIndex()
          }
        }
      } catch (AR) {
        $.report.nlog("éIEè·åå¿«éç»å½ä¿¡æ¯å¤±è´¥ï¼" + (AR.message || AR), "391627")
      }
    }
  };
  var K = function (r) {
    for (var q = 0, p = N.length; q < p; q++) {
      var s = N[q];
      if (s.uinString == r) {
        return s
      }
    }
    return null
  };
  var a = function () {
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
  var m = function () {
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
        z += o.replace(/#uin#/g, r).replace(/#nick#/g,function () {
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
  var S = function (q) {
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
  var L = function (s, r, t) {
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
  var f = function (q) {
    var p = pt.ptui.s_url;
    if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable && pt.plogin.isMailLogin()) {
      p = L(p, "ss", 1)
    }
    if (pt.plogin.isMailLogin() && q) {
      p = L(p, "account", encodeURIComponent(q))
    }
    return p
  };
  var G = function (p) {
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
  var V = function () {
    var p = M();
    pt.plogin.redirect(pt.ptui.target, p);
    if (pt.ptui.style == 20) {
      pt.plogin.showLoading(35)
    } else {
      pt.plogin.showLoading(10)
    }
  };
  var M = function () {
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
  var I = function (p) {
    p.onerror = null;
    if (p.src != pt.plogin.dftImg) {
      p.src = pt.plogin.dftImg
    }
    return false
  };
  var B = function (p) {
    var r = p.getAttribute("type");
    var q = p.getAttribute("uin");
    switch (r) {
      case"1":
        V();
        break;
      case"2":
        S(q);
        break
    }
  };
  var F = function (p) {
    if (!p) {
      return
    }
    var q = p.getAttribute("uin");
    if (q) {
      $("img_out_" + q).className = "img_out_focus"
    }
  };
  var U = function (p) {
    if (!p) {
      return
    }
    var q = p.getAttribute("uin");
    if (q) {
      $("img_out_" + q).className = "img_out"
    }
  };
  var b = function (p) {
    if (!p) {
      return
    }
    if (E != p) {
      U(E);
      E = p
    }
    F(p)
  };
  var D = function (p) {
    if (!p) {
      return
    }
    var q = p.getAttribute("uin");
    var r = $("mengban_" + q);
    r && (r.className = "face_mengban")
  };
  var O = function (p) {
    if (!p) {
      return
    }
    var q = p.getAttribute("uin");
    var r = $("mengban_" + q);
    r && (r.className = "")
  };
  var n = function () {
    var q = $("qlogin_list");
    var p = q.getElementsByTagName("a");
    if (p.length > 0) {
      E = p[0]
    }
  };
  var c = function () {
    try {
      E.focus()
    } catch (p) {
    }
  };
  var X = function () {
    var q = $("prePage");
    var p = $("nextPage");
    if (q) {
      $.e.add(q, "click", function (r) {
        A(1)
      })
    }
    if (p) {
      $.e.add(p, "click", function (r) {
        A(2)
      })
    }
  };
  var C = function () {
    var q = Y.length;
    for (var p = 0; p < q; p++) {
      if (Y[p].uinString) {
        $.http.loadScript((pt.ptui.isHttps ? "https://ssl.ptlogin2." : "http://ptlogin2.") + pt.ptui.domain + "/getface?appid=" + pt.ptui.appid + "&imgtype=3&encrytype=0&devtype=0&keytpye=0&uin=" + Y[p].uinString + "&r=" + Math.random())
      }
    }
  };
  var H = function () {
    X()
  };
  H();
  return{qloginInit: H, hasBuildQlogin: d, buildQloginList: m, imgClick: B, imgFocus: F, imgBlur: U, imgMouseover: b, imgMouseDowm: D, imgMouseUp: O, imgErr: I, focusHeader: c, initFace: C, authLoginSubmit: V, qloginClock: l, getSurl: f}
}();
function ptui_qlogin_CB(B, A, C) {
  window.clearTimeout(pt.qlogin.qloginClock);
  switch (B) {
    case"0":
      pt.plogin.redirect(pt.ptui.target, A);
      break;
    default:
      pt.plogin.switchpage(1);
      pt.plogin.show_err(C, true)
  }
}
pt.plogin = {accout: "", at_accout: "", uin: "", saltUin: "", hasCheck: false, lastCheckAccout: "", needVc: false, vcFlag: false, ckNum: {}, action: [0, 0], passwordErrorNum: 1, isIpad: false, t_appid: 46000101, seller_id: 703010802, checkUrl: "", loginUrl: "", verifycodeUrl: "", newVerifycodeUrl: "", needShowNewVc: false, pt_verifysession: "", checkClock: 0, isCheckTimeout: false, checkTime: 0, submitTime: 0, errclock: 0, loginClock: 0, login_param: pt.ptui.href.substring(pt.ptui.href.indexOf("?") + 1), err_m: $("err_m"), low_login_enable: true, low_login_hour: 720, low_login_isshow: false, list_index: [-1, 2], keyCode: {UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, ENTER: 13, TAB: 9, BACK: 8, DEL: 46, F5: 116}, knownEmail: (pt.ptui.style == 25 ? ["qq.com", "vip.qq.com", "foxmail.com"] : ["qq.com", "foxmail.com", "gmail.com", "hotmail.com", "yahoo.com", "sina.com", "163.com", "126.com", "vip.qq.com", "vip.sina.com", "sina.cn", "sohu.com", "yahoo.cn", "yahoo.com.cn", "139.com", "wo.com.cn", "189.cn", "live.com", "msn.com", "live.hk", "live.cn", "hotmail.com.cn", "hinet.net", "msa.hinet.net", "cm1.hinet.net", "umail.hinet.net", "xuite.net", "yam.com", "pchome.com.tw", "netvigator.com", "seed.net.tw", "anet.net.tw"]), qrlogin_clock: 0, qrlogin_timeout: 0, qrlogin_timeout_time: 100000, isQrLogin: false, qr_uin: "", qr_nick: "", dftImg: "", need_hide_operate_tips: true, js_type: 1, xuiState: 1, delayTime: 5000, delayMonitorId: "294059", hasSubmit: false, isdTime: {}, authUin: "", authSubmitUrl: "", loginState: 1, RSAKey: false, aqScanLink: "<a href='javascript:void(0)'; onclick='pt.plogin.switch_qrlogin()'>" + (pt.ptui.lang == "2052" ? "ç«å³æ«æ" : (pt.ptui.lang == "1028" ? "ç«å³ææ" : "Scan now")) + "</a>", isNewQr: false, hasNoQlogin: false, checkRet: -1, cap_cd: 0, checkErr: {"2052": "ç½ç»ç¹å¿ï¼è¯·ç¨åéè¯ã", "1028": "ç¶²çµ¡ç¹å¿ï¼è«ç¨å¾éè©¦ã", "1033": "The network is busy, please try again later."}, isMailLogin: function () {
  return pt.ptui.style == 25
}, domFocus: function (B) {
  try {
    B.focus()
  } catch (A) {
  }
}, formFocus: function () {
  var B = document.loginform;
  try {
    var A = B.u;
    var D = B.p;
    var E = B.verifycode;
    if (A.value == "") {
      A.focus();
      return
    }
    if (D.value == "") {
      D.focus();
      return
    }
    if (E.value == "") {
      E.focus()
    }
  } catch (C) {
  }
}, getAuthUrl: function () {
  var B = (pt.ptui.isHttps ? "https://ssl." : "http://") + "ptlogin2." + pt.ptui.domain + "/pt4_auth?daid=" + pt.ptui.daid + "&appid=" + pt.ptui.appid + "&auth_token=" + $.str.time33($.cookie.get("supertoken"));
  var A = pt.ptui.s_url;
  if (/^https/.test(A)) {
    B += "&pt4_shttps=1"
  }
  if (pt.ptui.pt_qzone_sig == "1") {
    B += "&pt_qzone_sig=1"
  }
  return B
}, auth: function () {
  pt.ptui.isHttps = $.check.isHttps();
  var A = pt.plogin.getAuthUrl();
  var B = $.cookie.get("superuin");
  if (pt.ptui.daid && pt.ptui.noAuth != "1" && B != "") {
    $.http.loadScript(A)
  } else {
    pt.plogin.init()
  }
}, initAuthInfo: function (A) {
  var B = $.cookie.get("uin").replace(/^o0*/, "");
  var C = $.str.utf8ToUincode($.cookie.get("ptuserinfo")) || B;
  $("auth_uin").innerHTML = $.str.encodeHtml(B);
  $("auth_nick").innerHTML = $.str.encodeHtml(C);
  $("auth_area").setAttribute("authUrl", $.str.encodeHtml(A));
  $.http.loadScript((pt.ptui.isHttps ? "https://ssl.ptlogin2." : "http://ptlogin2.") + pt.ptui.domain + "/getface?appid=" + pt.ptui.appid + "&imgtype=3&encrytype=0&devtype=0&keytpye=0&uin=" + B + "&r=" + Math.random())
}, showAuth: function (C, B) {
  if (C == 2) {
    $.css.hide($("cancleAuthOuter"))
  }
  pt.plogin.initAuthInfo(B);
  var A = pt.ptui.style;
  if (A == 22 || A == 23) {
    $.css.hide($("header"));
    $.css.hide($("authHeader"))
  }
  $("authLogin").style.height = $("login").offsetHeight - (A == 11 ? 2 : 4) + "px";
  $.css.show($("authLogin"));
  pt.plogin.ptui_notifySize("login")
}, cancleAuth: function () {
  var A = pt.ptui.style;
  if (A == 22 || A == 23) {
    $.css.show($("header"));
    $.css.show($("authHeader"))
  }
  $.css.hide($("authLogin"));
  pt.plogin.ptui_notifySize("login")
}, authLogin: function () {
  pt.qlogin.authLoginSubmit()
}, authMouseDowm: function (A) {
  var B = $("auth_mengban");
  B && (B.className = "face_mengban")
}, authMouseUp: function (A) {
  var B = $("auth_mengban");
  B && (B.className = "")
}, initQlogin: function (B) {
  var C = 0;
  var A = false;
  if (B && pt.ptui.auth_mode == 0) {
    A = true
  }
  if (pt.ptui.enable_qlogin != 0 && $.cookie.get("pt_qlogincode") != 5) {
    C = $.getLoginQQNum()
  }
  C += A ? 1 : 0;
  if (C == 0) {
    pt.plogin.hasNoQlogin = true
  }
  if (C > 0 || pt.plogin.isNewQr) {
    $("login").className = "login";
    $("switcher_plogin").innerHTML = pt.str.h_pt_login;
    if (pt.ptui.style == 34) {
      $("switcher_plogin").innerHTML = pt.str.otherqq_login
    }
    pt.plogin.switchpage(2);
    if (!pt.qlogin.hasBuildQlogin) {
      pt.qlogin.buildQloginList()
    }
  } else {
    pt.plogin.switchpage(1, true);
    $("login").className = "login_no_qlogin";
    $("switcher_plogin").innerHTML = pt.str.other_login;
    if (pt.ptui.style == 34) {
      $("switcher_plogin").innerHTML = pt.str.otherqq_login
    }
    if ($("u").value && pt.ptui.auth_mode == 0) {
      pt.plogin.check()
    }
  }
  if (pt.ptui.auth_mode != 0 && B) {
    pt.plogin.showAuth(pt.ptui.auth_mode, B)
  }
}, switchpage: function (A, C) {
  var D, B;
  pt.plogin.loginState = A;
  pt.plogin.hide_err();
  switch (A) {
    case 1:
      if (C) {
      }
      $.css.hide($("bottom_qlogin"));
      $.css.hide($("qlogin"));
      $.css.show($("web_qr_login"));
      $("qrswitch") && $.css.show($("qrswitch"));
      $("switcher_plogin").className = "switch_btn_focus";
      $("switcher_qlogin").className = "switch_btn";
      B = $("switcher_plogin").offsetWidth;
      D = $("switcher_plogin").parentNode.offsetWidth - B;
      if ($.browser("type") != "ff") {
        pt.plogin.formFocus()
      }
      if (pt.plogin.isNewQr) {
        pt.plogin.set_qrlogin_invalid()
      }
      if (pt.ptui.defaultUin && pt.ptui.style == 34) {
        $("u").disabled = true;
        var F = $("uinArea");
        F && F.setAttribute("class", F.getAttribute("class") + " default");
        var E = $("uin_del");
        E && E.parentNode.removeChild(E);
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
      D = 0;
      B = $("switcher_qlogin").offsetWidth;
      if (pt.plogin.isNewQr) {
        pt.plogin.begin_qrlogin()
      }
      break
  }
  window.setTimeout(function () {
    try {
      $.animate.animate("switch_bottom", {left: D, width: B}, 80, 20)
    } catch (G) {
      $("switch_bottom").style.left = D + "px";
      $("switch_bottom").style.width = B + "px"
    }
  }, 100);
  pt.plogin.ptui_notifySize("login")
}, detectCapsLock: function (C) {
  var B = C.keyCode || C.which;
  var A = C.shiftKey || (B == 16) || false;
  if (((B >= 65 && B <= 90) && !A) || ((B >= 97 && B <= 122) && A)) {
    return true
  } else {
    return false
  }
}, generateEmailTips: function (E) {
  var H = E.indexOf("@");
  var G = "";
  if (H == -1) {
    G = E
  } else {
    G = E.substring(0, H)
  }
  var B = [];
  for (var D = 0, A = pt.plogin.knownEmail.length; D < A; D++) {
    B.push(G + "@" + pt.plogin.knownEmail[D])
  }
  var F = [];
  for (var C = 0, A = B.length; C < A; C++) {
    if (B[C].indexOf(E) > -1) {
      F.push($.str.encodeHtml(B[C]))
    }
  }
  if (pt.ptui.style == 19) {
    F = []
  }
  return F
}, createEmailTips: function (E) {
  var A = pt.plogin.generateEmailTips(E);
  var G = A.length;
  var F = [];
  var D = "";
  var C = 4;
  G = Math.min(G, C);
  if (G == 0) {
    pt.plogin.list_index[0] = -1;
    pt.plogin.hideEmailTips();
    return
  }
  for (var B = 0; B < G; B++) {
    if (E == A[B]) {
      pt.plogin.hideEmailTips();
      return
    }
    D = "emailTips_" + B;
    if (0 == B) {
      F.push("<li id=" + D + " class='hover' >" + A[B] + "</li>")
    } else {
      F.push("<li id=" + D + ">" + A[B] + "</li>")
    }
  }
  $("email_list").innerHTML = F.join(" ");
  pt.plogin.list_index[0] = 0
}, showEmailTips: function () {
  $.css.show($("email_list"))
}, hideEmailTips: function () {
  $.css.hide($("email_list"))
}, setUrl: function () {
  var A = pt.ptui.domain;
  var B = $.check.isHttps() && $.check.isSsl();
  pt.plogin.checkUrl = (pt.ptui.isHttps ? "https://ssl." : "http://check.") + "ptlogin2." + A + "/check";
  pt.plogin.loginUrl = (pt.ptui.isHttps ? "https://ssl." : "http://") + "ptlogin2." + A + "/";
  pt.plogin.verifycodeUrl = (pt.ptui.isHttps ? "https://ssl." : "http://") + "captcha." + A + "/getimage";
  pt.plogin.newVerifycodeUrl = (pt.ptui.isHttps ? "https://ssl." : "http://") + "captcha.qq.com/cap_union_show?clientype=2";
  if (B && A != "qq.com" && A != "tenpay.com") {
    pt.plogin.verifycodeUrl = "https://ssl.ptlogin2." + A + "/ptgetimage"
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
}, init: function (A) {
  pt.plogin.setLowloginCheckbox();
  pt.plogin.isNewQr = (pt.ptui.style == 32 || pt.ptui.style == 33) ? true : false;
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
  pt.plogin.initQlogin(A);
  window.setTimeout(function () {
    pt.plogin.domLoad()
  }, 500)
}, aq_patch: function () {
  if (Math.random() < 0.05 && !pt.ptui.isHttps) {
    $.http.loadScript("http://mat1.gtimg.com/www/js/common_v2.js", function () {
      if (typeof checkNonTxDomain == "function") {
        try {
          checkNonTxDomain(1, 5)
        } catch (A) {
        }
      }
    })
  }
}, hideVipLink: function () {
  var B = $("vip_link2");
  var A = $("vip_dot");
  if ((B && A) && (!$.check.needVip(pt.ptui.appid) || pt.ptui.lang != "2052")) {
    $.css.addClass(B, "hide");
    $.css.addClass(A, "hide")
  }
}, set_default_uin: function (A) {
  if (A) {
  } else {
    A = unescape($.cookie.getOrigin("ptui_loginuin"));
    if (pt.ptui.appid != pt.plogin.t_appid && ($.check.isNick(A) || $.check.isName(A))) {
      A = $.cookie.get("pt2gguin").replace(/^o/, "") - 0;
      A = A == 0 ? "" : A
    }
  }
  $("u").value = A;
  if (A) {
    $.css.hide($("uin_tips"));
    $.css.show($("uin_del"));
    pt.plogin.set_accout()
  }
}, set_accout: function () {
  var A = $.str.trim($("u").value);
  var B = pt.ptui.appid;
  pt.plogin.accout = A;
  pt.plogin.at_accout = A;
  if ($.check.isQiyeQQ800(A)) {
    pt.plogin.at_accout = "@" + A;
    return true
  }
  if ($.check.is_weibo_appid(B)) {
    if ($.check.isQQ(A) || $.check.isMail(A)) {
      return true
    } else {
      if ($.check.isNick(A) || $.check.isName(A)) {
        pt.plogin.at_accout = "@" + A;
        return true
      } else {
        if ($.check.isPhone(A)) {
          pt.plogin.at_accout = "@" + A.replace(/^(86|886)/, "");
          return true
        } else {
          if ($.check.isSeaPhone(A)) {
            pt.plogin.at_accout = "@00" + A.replace(/^(00)/, "");
            if (/^(@0088609)/.test(pt.plogin.at_accout)) {
              pt.plogin.at_accout = pt.plogin.at_accout.replace(/^(@0088609)/, "@008869")
            }
            return true
          }
        }
      }
    }
  } else {
    if ($.check.isQQ(A) || $.check.isMail(A)) {
      return true
    }
    if ($.check.isPhone(A)) {
      pt.plogin.at_accout = "@" + A.replace(/^(86|886)/, "");
      return true
    }
    if ($.check.isNick(A)) {
      $("u").value = A + "@qq.com";
      pt.plogin.accout = A + "@qq.com";
      pt.plogin.at_accout = A + "@qq.com";
      return true
    }
  }
  if ($.check.isForeignPhone(A)) {
    pt.plogin.at_accout = "@" + A
  }
  return true
}, show_err: function (B, A) {
  pt.plogin.hideLoading();
  $.css.show($("error_tips"));
  pt.plogin.err_m.innerHTML = B;
  clearTimeout(pt.plogin.errclock);
  if (!A) {
    pt.plogin.errclock = setTimeout("pt.plogin.hide_err()", 5000)
  }
}, hide_err: function () {
  $.css.hide($("error_tips"));
  pt.plogin.err_m.innerHTML = ""
}, showAssistant: function (A) {
  if (pt.ptui.lang != "2052") {
    return
  }
  pt.plogin.hideLoading();
  $.css.show($("error_tips"));
  switch (A) {
    case 0:
      pt.plogin.err_m.innerHTML = "å¿«éç»å½å¼å¸¸ï¼è¯è¯<a class='tips_link' style='color: #29B1F1' href='/assistant/troubleshooter.html' target='_blank'>ç»å½å©æ</a>ä¿®å¤";
      $.report.monitor("315785");
      break;
    case 1:
      pt.plogin.err_m.innerHTML = "å¿«éç»å½å¼å¸¸ï¼è¯è¯<a class='tips_link' style='color: #29B1F1' href='/assistant/troubleshooter.html' target='_blank'>ç»å½å©æ</a>ä¿®å¤";
      $.report.monitor("315786");
      break;
    case 2:
      pt.plogin.err_m.innerHTML = "ç»å½å¼å¸¸ï¼è¯è¯<a class='tips_link' style='color: #29B1F1' href='/assistant/troubleshooter.html' target='_blank'>ç»å½å©æ</a>ä¿®å¤";
      $.report.monitor("315787");
      break;
    case 3:
      pt.plogin.err_m.innerHTML = "å¿«éç»å½å¼å¸¸ï¼è¯è¯<a class='tips_link' style='color: #29B1F1' href='http://im.qq.com/qq/2013/' target='_blank' onclick='$.report.monitor(326049);'>åçº§QQ</a>ä¿®å¤";
      $.report.monitor("326046");
      break
  }
}, showGuanjiaTips: function () {
  $.initGuanjiaPlugin();
  if ($.guanjiaPlugin) {
    $.guanjiaPlugin.QMStartUp(16, '/traytip=3 /tipProblemid=1401 /tipSource=18 /tipType=0 /tipIdParam=0 /tipIconUrl="http://dldir2.qq.com/invc/xfspeed/qqpcmgr/clinic/image/tipsicon_qq.png" /tipTitle="QQå¿«éç»å½å¼å¸¸?" /tipDesc="ä¸è½ç¨å·²ç»å½çQQå·å¿«éç»å½ï¼åªè½æå¨è¾å¥è´¦å·å¯ç ï¼å»ºè®®ç¨çµèè¯æä¸é®ä¿®å¤ã"');
    $.report.monitor("316548")
  } else {
    $.report.monitor("316549")
  }
}, showLoading: function (A) {
  pt.plogin.hide_err();
  $("loading_tips").style.top = A + "px";
  $.css.show($("loading_tips"))
}, hideLoading: function () {
  $.css.hide($("loading_tips"))
}, showLowList: function () {
  var A = $("combox_list");
  if (A) {
    $.css.show(A);
    pt.plogin.low_login_isshow = true
  }
}, hideLowList: function () {
  var A = $("combox_list");
  if (A) {
    $.css.hide(A);
    pt.plogin.low_login_isshow = false
  }
}, u_focus: function () {
  if ($("u").value == "") {
    $.css.show($("uin_tips"));
    $("uin_tips").className = "input_tips_focus"
  }
  $("u").parentNode.className = "inputOuter_focus"
}, u_blur: function () {
  if ($("u").value == "") {
    $.css.show($("uin_tips"));
    $("uin_tips").className = "input_tips"
  } else {
    pt.plogin.set_accout();
    pt.plogin.check()
  }
  $("u").parentNode.className = "inputOuter"
}, u_mouseover: function () {
  var A = $("u").parentNode;
  if (A.className == "inputOuter_focus") {
  } else {
    $("u").parentNode.className = "inputOuter_hover"
  }
}, u_mouseout: function () {
  var A = $("u").parentNode;
  if (A.className == "inputOuter_focus") {
  } else {
    $("u").parentNode.className = "inputOuter"
  }
}, window_blur: function () {
  pt.plogin.lastCheckAccout = ""
}, u_change: function () {
  pt.plogin.set_accout();
  pt.plogin.passwordErrorNum = 1;
  pt.plogin.hasCheck = false;
  pt.plogin.hasSubmit = false
}, list_keydown: function (H, F) {
  var E = $("email_list");
  var D = $("u");
  if (F == 1) {
    var E = $("combox_list")
  }
  var G = E.getElementsByTagName("li");
  var B = G.length;
  var A = H.keyCode;
  switch (A) {
    case pt.plogin.keyCode.UP:
      G[pt.plogin.list_index[F]].className = "";
      pt.plogin.list_index[F] = (pt.plogin.list_index[F] - 1 + B) % B;
      G[pt.plogin.list_index[F]].className = "hover";
      break;
    case pt.plogin.keyCode.DOWN:
      G[pt.plogin.list_index[F]].className = "";
      pt.plogin.list_index[F] = (pt.plogin.list_index[F] + 1) % B;
      G[pt.plogin.list_index[F]].className = "hover";
      break;
    case pt.plogin.keyCode.ENTER:
      var C = G[pt.plogin.list_index[F]].innerHTML;
      if (F == 0) {
        $("u").value = $.str.decodeHtml(C)
      }
      pt.plogin.hideEmailTips();
      pt.plogin.hideLowList();
      H.preventDefault();
      break;
    case pt.plogin.keyCode.TAB:
      pt.plogin.hideEmailTips();
      pt.plogin.hideLowList();
      break;
    default:
      break
  }
  if (F == 1) {
    $("combox_box").innerHTML = G[pt.plogin.list_index[F]].innerHTML;
    $("low_login_hour").value = G[pt.plogin.list_index[F]].getAttribute("value")
  }
}, u_keydown: function (A) {
  $.css.hide($("uin_tips"));
  if (pt.plogin.list_index[0] == -1) {
    return
  }
  pt.plogin.list_keydown(A, 0)
}, u_keyup: function (B) {
  var C = this.value;
  if (C == "") {
    $.css.show($("uin_tips"));
    $("uin_tips").className = "input_tips_focus";
    $.css.hide($("uin_del"))
  } else {
    $.css.show($("uin_del"))
  }
  var A = B.keyCode;
  if (A != pt.plogin.keyCode.UP && A != pt.plogin.keyCode.DOWN && A != pt.plogin.keyCode.ENTER && A != pt.plogin.keyCode.TAB && A != pt.plogin.keyCode.F5) {
    if ($("u").value.indexOf("@") > -1) {
      pt.plogin.showEmailTips();
      pt.plogin.createEmailTips($("u").value)
    } else {
      pt.plogin.hideEmailTips()
    }
  }
}, email_mousemove: function (C) {
  var B = C.target;
  if (B.tagName.toLowerCase() != "li") {
    return
  }
  var A = $("emailTips_" + pt.plogin.list_index[0]);
  if (A) {
    A.className = ""
  }
  B.className = "hover";
  pt.plogin.list_index[0] = parseInt(B.getAttribute("id").substring(10));
  C.stopPropagation()
}, email_click: function (C) {
  var B = C.target;
  if (B.tagName.toLowerCase() != "li") {
    return
  }
  var A = $("emailTips_" + pt.plogin.list_index[0]);
  if (A) {
    $("u").value = $.str.decodeHtml(A.innerHTML);
    pt.plogin.set_accout();
    pt.plogin.check()
  }
  pt.plogin.hideEmailTips();
  C.stopPropagation()
}, p_focus: function () {
  if (this.value == "") {
    $.css.show($("pwd_tips"));
    $("pwd_tips").className = "input_tips_focus"
  }
  this.parentNode.className = "inputOuter_focus";
  pt.plogin.check()
}, p_blur: function () {
  if (this.value == "") {
    $.css.show($("pwd_tips"));
    $("pwd_tips").className = "input_tips"
  }
  $.css.hide($("caps_lock_tips"));
  this.parentNode.className = "inputOuter"
}, p_mouseover: function () {
  var A = $("p").parentNode;
  if (A.className == "inputOuter_focus") {
  } else {
    $("p").parentNode.className = "inputOuter_hover"
  }
}, p_mouseout: function () {
  var A = $("p").parentNode;
  if (A.className == "inputOuter_focus") {
  } else {
    $("p").parentNode.className = "inputOuter"
  }
}, p_keydown: function (A) {
  $.css.hide($("pwd_tips"))
}, p_keyup: function () {
  if (this.value == "") {
    $.css.show($("pwd_tips"))
  }
}, p_keypress: function (A) {
  if (pt.plogin.detectCapsLock(A)) {
    $.css.show($("caps_lock_tips"))
  } else {
    $.css.hide($("caps_lock_tips"))
  }
}, vc_focus: function () {
  if (this.value == "") {
    $.css.show($("vc_tips"));
    $("vc_tips").className = "input_tips_focus"
  }
  this.parentNode.className = "inputOuter_focus"
}, vc_blur: function () {
  if (this.value == "") {
    $.css.show($("vc_tips"));
    $("vc_tips").className = "input_tips"
  }
  this.parentNode.className = "inputOuter"
}, vc_keydown: function () {
  $.css.hide($("vc_tips"))
}, vc_keyup: function () {
  if (this.value == "") {
    $.css.show($("vc_tips"))
  }
}, document_click: function () {
  pt.plogin.action[0]++;
  pt.plogin.hideEmailTips();
  pt.plogin.hideLowList()
}, document_keydown: function () {
  pt.plogin.action[1]++
}, setLowloginCheckbox: function () {
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
}, checkbox_click: function () {
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
}, feedback: function (D) {
  var C = D ? D.target : null;
  var A = C ? C.id + "-" : "";
  var B = "http://support.qq.com/write.shtml?guest=1&fid=713&SSTAG=hailunna-" + A + $.str.encodeHtml(pt.plogin.accout);
  window.open(B)
}, bind_account: function () {
  $.css.hide($("operate_tips"));
  pt.plogin.need_hide_operate_tips = true;
  window.open("http://id.qq.com/index.html#account");
  $.report.monitor("234964")
}, combox_click: function (A) {
  if (pt.plogin.low_login_isshow) {
    pt.plogin.hideLowList()
  } else {
    pt.plogin.showLowList()
  }
  A.stopPropagation()
}, delUin: function (A) {
  A && $.css.hide(A.target);
  $("u").value = "";
  pt.plogin.domFocus($("u"))
}, check_cdn_img: function () {
  if (!window.g_cdn_js_fail || pt.ptui.isHttps) {
    return
  }
  var A = new Image();
  A.onload = function () {
    A.onload = A.onerror = null
  };
  A.onerror = function () {
    A.onload = A.onerror = null;
    var D = $("main_css").innerHTML;
    var B = "http://imgcache.qq.com/ptlogin/v4/style/";
    var C = "http://ui.ptlogin2.qq.com/style/";
    D = D.replace(new RegExp(B, "g"), C);
    pt.plogin.insertInlineCss(D);
    $.report.monitor(312520)
  };
  A.src = "http://imgcache.qq.com/ptlogin/v4/style/20/images/c_icon_1.png"
}, insertInlineCss: function (A) {
  if (document.createStyleSheet) {
    var C = document.createStyleSheet("");
    C.cssText = A
  } else {
    var B = document.createElement("style");
    B.type = "text/css";
    B.textContent = A;
    document.getElementsByTagName("head")[0].appendChild(B)
  }
}, createLink: function (A) {
  var B = document.createElement("link");
  B.setAttribute("type", "text/css");
  B.setAttribute("rel", "stylesheet");
  B.setAttribute("href", A);
  document.getElementsByTagName("head")[0].appendChild(B)
}, checkInputLable: function () {
  try {
    if ($("u").value) {
      $.css.hide($("uin_tips"))
    }
    window.setTimeout(function () {
      if ($("p").value) {
        $.css.hide($("pwd_tips"))
      }
    }, 1000)
  } catch (A) {
  }
}, domLoad: function (B) {
  if (pt.plogin.hasDomLoad) {
    return
  } else {
    pt.plogin.hasDomLoad = true
  }
  pt.plogin.checkInputLable();
  pt.plogin.checkNPLoad();
  if (pt.plogin.isNewQr) {
    pt.plogin.begin_qrlogin()
  }
  pt.qlogin.initFace();
  pt.plogin.loadQrTipsPic();
  var A = $("loading_img");
  if (A) {
    A.setAttribute("src", A.getAttribute("place_src"))
  }
  pt.plogin.check_cdn_img();
  pt.plogin.ptui_notifySize("login");
  $.report.monitor("373507&union=256042", 0.05);
  pt.plogin.webLoginReport();
  pt.plogin.monitorQQNum();
  pt.plogin.aq_patch()
}, checkNPLoad: function () {
  if (navigator.mimeTypes["application/nptxsso"] && !$.sso_loadComplete) {
    $.checkNPPlugin()
  }
}, monitorQQNum: function () {
  var A = $.loginQQnum;
  switch (A) {
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
}, noscript_err: function () {
  $.report.nlog("noscript_err", 316648);
  $("noscript_area").style.display = "none"
}, bindEvent: function () {
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
    $.e.add(domQr_img, "click", function (e) {
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
    $.e.add(domGoback, "click", function (e) {
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
    $.e.add(domQloginSwitch, "click", function (e) {
      pt.plogin.switchpage(2);
      $.report.monitor("331284", 0.05);
      e.preventDefault()
    })
  }
  if (domLoginSwitch) {
    $.e.add(domLoginSwitch, "click", function (e) {
      e.preventDefault();
      pt.plogin.switchpage(1);
      $.report.monitor("331285", 0.05)
    })
  }
  if (domBindAccount) {
    $.e.add(domBindAccount, "click", pt.plogin.bind_account);
    $.e.add(domBindAccount, "mouseover", function (e) {
      pt.plogin.need_hide_operate_tips = false
    });
    $.e.add(domBindAccount, "mouseout", function (e) {
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
  $.e.add(domBtn, "click", function (e) {
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
  $.e.add(window, "message", function (e) {
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
        case"1":
          pt.plogin.vcodeMessage(data);
          break;
        case"2":
          pt.plogin.hideVC();
          break
      }
    }
  });
  navigator.captcha_callback = function (data) {
    var type = data.type;
    switch (type + "") {
      case"1":
        pt.plogin.vcodeMessage(data);
        break;
      case"2":
        pt.plogin.hideVC();
        break
    }
  };
  var noscript_img = $("noscript_img");
  if (noscript_img) {
    $.e.add(noscript_img, "load", pt.plogin.noscript_err);
    $.e.add(noscript_img, "error", pt.plogin.noscript_err)
  }
}, vcodeMessage: function (A) {
  if (!A.randstr || !A.sig) {
    $.report.nlog("vcode postMessage errorï¼" + e.data)
  }
  $("verifycode").value = A.randstr;
  pt.plogin.pt_verifysession = A.sig;
  pt.plogin.hideVC();
  pt.plogin.submit()
}, showNewVC: function () {
  var A = pt.plogin.getNewVCUrl();
  var B = $("newVcodeArea");
  B.style.height = $("login").offsetHeight - (pt.ptui.style == 21 ? 2 : 4) + "px";
  B.innerHTML = '<iframe name="vcode" allowtransparency="true" scrolling="no" frameborder="0" width="100%" height="100%" src="' + A + '">';
  $.css.show(B)
}, hideNewVC: function () {
  $.css.hide($("newVcodeArea"))
}, changeNewVC: function () {
  pt.plogin.showNewVC()
}, showVC: function () {
  pt.plogin.vcFlag = true;
  if (pt.ptui.pt_vcode_v1 == "1") {
    pt.plogin.showNewVC()
  } else {
    $.css.show($("verifyArea"));
    $("verifycode").value = "";
    var A = $("verifyimg");
    var B = pt.plogin.getVCUrl();
    A.src = B
  }
  pt.plogin.ptui_notifySize("login")
}, hideVC: function () {
  pt.plogin.vcflag = false;
  if (pt.ptui.pt_vcode_v1 == "1") {
    pt.plogin.hideNewVC()
  } else {
    $.css.hide($("verifyArea"))
  }
  pt.plogin.ptui_notifySize("login")
}, changeVC: function (B) {
  B && B.preventDefault();
  var A = $("verifyimg");
  var C = pt.plogin.getVCUrl();
  A.src = C;
  B && $.report.monitor("330322", 0.05)
}, getVCUrl: function () {
  var D = pt.plogin.at_accout;
  var C = pt.ptui.domain;
  var B = pt.ptui.appid;
  var A = pt.plogin.verifycodeUrl + "?uin=" + D + "&aid=" + B + "&cap_cd=" + pt.plogin.cap_cd + "&" + Math.random();
  return A
}, getNewVCUrl: function () {
  var D = pt.plogin.at_accout;
  var C = pt.ptui.domain;
  var B = pt.ptui.appid;
  var A = pt.plogin.newVerifycodeUrl + "&uin=" + D + "&aid=" + B + "&cap_cd=" + pt.plogin.cap_cd + "&" + Math.random();
  return A
}, checkValidate: function (B) {
  try {
    var A = B.u;
    var D = B.p;
    var E = B.verifycode;
    if ($.str.trim(A.value) == "") {
      pt.plogin.show_err(pt.str.no_uin);
      pt.plogin.domFocus(A);
      return false
    }
    if ($.check.isNullQQ(A.value)) {
      pt.plogin.show_err(pt.str.inv_uin);
      pt.plogin.domFocus(A);
      return false
    }
    if (D.value == "") {
      pt.plogin.show_err(pt.str.no_pwd);
      pt.plogin.domFocus(D);
      return false
    }
    if (E.value == "") {
      if (!pt.plogin.needVc && !pt.plogin.vcFlag) {
        pt.plogin.checkResultReport(14);
        clearTimeout(pt.plogin.checkClock);
        pt.plogin.showVC()
      } else {
        pt.plogin.show_err(pt.str.no_vcode);
        pt.plogin.domFocus(E)
      }
      return false
    }
    if (E.value.length < 4) {
      pt.plogin.show_err(pt.str.inv_vcode);
      pt.plogin.domFocus(E);
      E.select();
      return false
    }
  } catch (C) {
  }
  return true
}, checkTimeout: function () {
  var A = $.str.trim($("u").value);
  if ($.check.isQQ(A) || $.check.isQQMail(A)) {
    pt.plogin.cap_cd = 0;
    pt.plogin.saltUin = $.str.uin2hex(A.replace("@qq.com", ""));
    pt.plogin.needVc = true;
    pt.plogin.needShowNewVc = true;
    pt.plogin.showVC();
    pt.plogin.isCheckTimeout = true;
    pt.plogin.checkRet = 1
  }
}, loginTimeout: function () {
  pt.plogin.showAssistant(2);
  var A = "flag1=7808&flag2=7&flag3=1&1=1000";
  $.report.simpleIsdSpeed(A)
}, check: function () {
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
  var B = pt.ptui.appid;
  var A = pt.plogin.getCheckUrl(pt.plogin.at_accout, B);
  pt.plogin.isCheckTimeout = false;
  clearTimeout(pt.plogin.checkClock);
  pt.plogin.checkClock = setTimeout("pt.plogin.checkTimeout();", 5000);
  $.http.loadScript(A)
}, getCheckUrl: function (B, C) {
  var A = pt.plogin.checkUrl + "?regmaster=" + pt.ptui.regmaster + "&";
  A += "uin=" + B + "&appid=" + C + "&js_ver=" + pt.ptui.ptui_version + "&js_type=" + pt.plogin.js_type + "&login_sig=" + pt.ptui.login_sig + "&u1=" + encodeURIComponent(pt.ptui.s_url) + "&r=" + Math.random();
  return A
}, getSubmitUrl: function (B) {
  var A = pt.plogin.loginUrl + B + "?";
  var D = {};
  if (B == "login") {
    D.u = encodeURIComponent(pt.plogin.at_accout);
    D.verifycode = $("verifycode").value;
    if (pt.plogin.needShowNewVc && pt.plogin.pt_verifysession) {
      D.pt_vcode_v1 = 1;
      D.pt_verifysession_v1 = pt.plogin.pt_verifysession
    }
    if (pt.plogin.RSAKey) {
      D.p = $.Encryption.getRSAEncryption($("p").value, D.verifycode);
      D.pt_rsa = 1
    } else {
      D.p = $.Encryption.getEncryption($("p").value, pt.plogin.saltUin, D.verifycode);
      D.pt_rsa = 0
    }
  }
  D.ptredirect = pt.ptui.target;
  D.u1 = encodeURIComponent(pt.qlogin.getSurl($("u").value));
  D.h = 1;
  D.t = 1;
  D.g = 1;
  D.from_ui = 1;
  D.ptlang = pt.ptui.lang;
  D.action = pt.plogin.action.join("-") + "-" + (new Date() - 0);
  D.js_ver = pt.ptui.ptui_version;
  D.js_type = pt.plogin.js_type;
  D.login_sig = pt.ptui.login_sig;
  D.pt_uistyle = pt.ptui.style;
  if (pt.ptui.low_login == 1 && pt.plogin.low_login_enable && !pt.plogin.isMailLogin()) {
    D.low_login_enable = 1;
    D.low_login_hour = pt.plogin.low_login_hour
  }
  if (pt.ptui.csimc != "0") {
    D.csimc = pt.ptui.csimc;
    D.csnum = pt.ptui.csimc;
    D.authid = pt.ptui.csimc
  }
  D.aid = pt.ptui.appid;
  if (pt.ptui.daid) {
    D.daid = pt.ptui.daid
  }
  if (pt.ptui.pt_3rd_aid != "0") {
    D.pt_3rd_aid = pt.ptui.pt_3rd_aid
  }
  if (pt.ptui.regmaster) {
    D.regmaster = pt.ptui.regmaster
  }
  if (pt.ptui.mibao_css) {
    D.mibao_css = pt.ptui.mibao_css
  }
  if (pt.ptui.pt_qzone_sig == "1") {
    D.pt_qzone_sig = 1
  }
  if (pt.ptui.pt_light == "1") {
    D.pt_light = 1
  }
  for (var C in D) {
    A += (C + "=" + D[C] + "&")
  }
  return A
}, submit: function (A) {
  pt.plogin.submitTime = new Date().getTime();
  A && A.preventDefault();
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
  var B = pt.plogin.getSubmitUrl("login");
  $.winName.set("login_href", encodeURIComponent(pt.ptui.href));
  pt.plogin.showLoading(20);
  if (pt.plogin.isVCSessionTimeOut() && !pt.plogin.needVc) {
    pt.plogin.lastCheckAccout = "";
    pt.plogin.check();
    window.setTimeout(function () {
      pt.plogin.submit()
    }, 1000)
  } else {
    $.http.loadScript(B);
    pt.plogin.isdTime["7808-7-2-0"] = new Date().getTime()
  }
  return false
}, isVCSessionTimeOut: function () {
  pt.plogin.checkTime = pt.plogin.checkTime || new Date().getTime();
  if (pt.plogin.submitTime - pt.plogin.checkTime > 1200000) {
    $.report.monitor(330323, 0.05);
    return true
  } else {
    return false
  }
}, webLoginReport: function () {
  window.setTimeout(function () {
    try {
      var D = ["navigationStart", "unloadEventStart", "unloadEventEnd", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "requestStart", "responseStart", "responseEnd", "domLoading", "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd"];
      var F = {};
      var C = window.performance ? window.performance.timing : null;
      if (C) {
        for (var B = 1, A = D.length; B < A; B++) {
          if (C[D[B]]) {
            F[B] = C[D[B]] - C[D[0]]
          }
        }
        if ((C.domContentLoadedEventEnd - C.navigationStart > pt.plogin.delayTime) && C.navigationStart > 0) {
          $.report.nlog("è®¿é®uiå»¶æ¶è¶è¿" + pt.plogin.delayTime / 1000 + "s:delay=" + (C.domContentLoadedEventEnd - C.navigationStart) + ";domContentLoadedEventEnd=" + C.domContentLoadedEventEnd + ";navigationStart=" + C.navigationStart + ";clientip=" + pt.ptui.clientip + ";serverip=" + pt.ptui.serverip, pt.plogin.delayMonitorId, 1)
        }
        if (C.connectStart <= C.connectEnd && C.responseStart <= C.responseEnd) {
          pt.plogin.ptui_speedReport(F)
        }
      }
    } catch (E) {
    }
  }, 1000)
}, ptui_speedReport: function (D) {
  if ($.browser("type") != "msie" && $.browser("type") != "webkit") {
    return
  }
  var B = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=1";
  if (pt.ptui.isHttps) {
    if (Math.random() > 1) {
      return
    }
    if ($.browser("type") == "msie") {
      if ($.check.isSsl()) {
        B = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=3"
      } else {
        B = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=2"
      }
    } else {
      if ($.check.isSsl()) {
        B = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=6"
      } else {
        B = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=5"
      }
    }
  } else {
    if (Math.random() > 0.2) {
      return
    }
    if ($.browser("type") == "msie") {
      B = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=1"
    } else {
      B = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=4"
    }
  }
  for (var C in D) {
    if (D[C] > 15000 || D[C] < 0) {
      continue
    }
    B += "&" + C + "=" + D[C] || 1
  }
  var A = new Image();
  A.src = B
}, resultReport: function (B, A, E) {
  var D = "http://isdspeed.qq.com/cgi-bin/v.cgi?flag1=" + B + "&flag2=" + A + "&flag3=" + E;
  var C = new Image();
  C.src = D
}, crossMessage: function (D) {
  if (typeof window.postMessage != "undefined") {
    var B = $.str.json2str(D);
    window.parent.postMessage(B, "*")
  } else {
    if (!pt.ptui.proxy_url) {
      try {
        navigator.ptlogin_callback($.str.json2str(D))
      } catch (C) {
        $.report.nlog(C.message)
      }
    } else {
      var E = pt.ptui.proxy_url + "#";
      for (var A in D) {
        E += (A + "=" + D[A] + "&")
      }
      $("proxy") && ($("proxy").innerHTML = '<iframe src="' + encodeURI(E) + '"></iframe>')
    }
  }
}, ptui_notifyClose: function (A) {
  A && A.preventDefault();
  var B = {};
  B.action = "close";
  pt.plogin.crossMessage(B);
  pt.plogin.cancle_qrlogin()
}, ptui_notifySize: function (C) {
  if (pt.plogin.loginState == 1) {
    $("bottom_web") && $.css.hide($("bottom_web"));
    pt.plogin.adjustLoginsize();
    $("bottom_web") && $.css.show($("bottom_web"))
  }
  var A = $(C);
  var B = {};
  B.action = "resize";
  B.width = A.offsetWidth || 1;
  B.height = A.offsetHeight || 1;
  pt.plogin.crossMessage(B)
}, ptui_onLogin: function (B) {
  var A = true;
  A = pt.plogin.checkValidate(B);
  return A
}, ptui_uin: function (A) {
}, is_mibao: function (A) {
  return/^http(s)?:\/\/ui.ptlogin2.(\S)+\/cgi-bin\/mibao_vry/.test(A)
}, get_qrlogin_pic: function () {
  var B = "ptqrshow";
  var A = (pt.ptui.isHttps ? "https://ssl." : "http://") + "ptlogin2." + pt.ptui.domain + "/" + B + "?";
  if (pt.ptui.regmaster == 2) {
    A = "http://ptlogin2.function.qq.com/" + B + "?regmaster=2&"
  } else {
    if (pt.ptui.regmaster == 3) {
      A = "http://ptlogin2.crm2.qq.com/" + B + "?regmaster=3&"
    }
  }
  A += "appid=" + pt.ptui.appid + "&e=2&l=M&s=3&d=72&v=4&t=" + Math.random();
  return A
}, go_qrlogin_step: function (A) {
  switch (A) {
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
}, begin_qrlogin: function () {
  pt.plogin.cancle_qrlogin();
  $("qr_invalid") && $.css.hide($("qr_invalid"));
  $("qrlogin_img") && ($("qrlogin_img").src = pt.plogin.get_qrlogin_pic());
  pt.plogin.qrlogin_clock = window.setInterval("pt.plogin.qrlogin_submit();", 3000);
  pt.plogin.qrlogin_timeout = window.setTimeout(function () {
    pt.plogin.set_qrlogin_invalid()
  }, pt.plogin.qrlogin_timeout_time)
}, cancle_qrlogin: function () {
  window.clearInterval(pt.plogin.qrlogin_clock);
  window.clearTimeout(pt.plogin.qrlogin_timeout)
}, set_qrlogin_invalid: function () {
  pt.plogin.cancle_qrlogin();
  pt.plogin.switch_qrlogin();
  $("qr_invalid") && $.css.show($("qr_invalid"));
  pt.plogin.hideQrTips()
}, createLink: function (A) {
  var B = document.createElement("link");
  B.setAttribute("type", "text/css");
  B.setAttribute("rel", "stylesheet");
  B.setAttribute("href", A);
  document.getElementsByTagName("head")[0].appendChild(B)
}, loadQrTipsPic: function () {
  if (pt.plogin.isNewQr) {
    var B = $("qr_tips_pic");
    var C = "chs";
    switch (pt.ptui.lang + "") {
      case"2052":
        C = "chs";
        break;
      case"1033":
        C = "en";
        break;
      case"1028":
        C = "cht";
        break
    }
    $.css.addClass(B, "qr_tips_pic_" + C)
  } else {
    var A = pt.ptui.cssPath + "/c_qr_login.css";
    $("qrswitch_logo") && pt.plogin.createLink(A)
  }
}, showQrTips: function () {
  var A = {}, C, B;
  B = $.css.getOffsetPosition("qrlogin_img");
  C = $.css.getOffsetPosition("login");
  A.left = B.left - C.left;
  if (pt.plogin.hasNoQlogin) {
  } else {
    A.left = A.left + $.css.getWidth("qrlogin_img") + 10;
    $("qr_tips").style.left = A.left + "px"
  }
  $.css.show($("qr_tips"));
  $("qr_tips_pic").style.opacity = 0;
  $("qr_tips_pic").style.filter = "alpha(opacity=0)";
  $("qr_tips_menban").className = "qr_tips_menban";
  if (pt.plogin.hasNoQlogin) {
    $.animate.fade("qr_tips_pic", 100, 2, 20, function () {
    });
    $.animate.animate("qrlogin_img", {left: -30}, 10, 10)
  } else {
    $.animate.fade("qr_tips_pic", 100, 2, 20)
  }
  pt.plogin.hideQrTipsClock = window.setTimeout("pt.plogin.hideQrTips()", 5000);
  $.report.monitor("331286", 0.05)
}, hideQrTips: function () {
  if (!pt.plogin.isNewQr) {
    return
  }
  window.clearTimeout(pt.plogin.hideQrTipsClock);
  $("qr_tips_menban").className = "";
  $.animate.fade("qr_tips_pic", 0, 5, 20, function () {
    if (pt.plogin.hasNoQlogin) {
      $.animate.animate("qrlogin_img", {left: 12}, 10, 10)
    }
    $.css.hide($("qr_tips"))
  })
}, qr_load: function (A) {
}, qr_error: function (A) {
  pt.plogin.set_qrlogin_invalid()
}, switch_qrlogin_animate: function () {
  var B = pt.plogin.isQrLogin;
  var A = $("web_qr_login_show");
  var C = 0;
  if (B) {
    C = -$("web_login").offsetHeight;
    $("web_qr_login").style.height = ($("qrlogin").offsetHeight || 265) + "px";
    $("qrlogin").style.visibility = "";
    $("web_login").style.visibility = "hidden"
  } else {
    C = 0;
    $("web_qr_login").style.height = $("web_login").offsetHeight + "px";
    $("web_login").style.visibility = "";
    $("qrlogin").style.visibility = "hidden"
  }
  $.animate.animate(A, {top: C}, 30, 20)
}, switch_qrlogin: function (A) {
  if (pt.plogin.isNewQr) {
    return
  }
  A && A.preventDefault();
  pt.plogin.hide_err();
  if (!pt.plogin.isQrLogin) {
    pt.plogin.go_qrlogin_step(1);
    $("qrswitch_logo").title = "è¿å";
    $("qrswitch_logo").className = "qrswitch_logo_qr";
    pt.plogin.begin_qrlogin();
    $.report.monitor("273367", 0.05)
  } else {
    pt.plogin.cancle_qrlogin();
    $("qrswitch_logo").title = "äºç»´ç ç»å½";
    $("qrswitch_logo").className = "qrswitch_logo";
    $.report.monitor("273368", 0.05)
  }
  pt.plogin.isQrLogin = !pt.plogin.isQrLogin;
  pt.plogin.switch_qrlogin_animate();
  pt.plogin.ptui_notifySize("login")
}, adjustLoginsize: function () {
  var A = pt.plogin.isQrLogin;
  if (A) {
    $("web_qr_login").style.height = ($("qrlogin").offsetHeight || 265) + "px"
  } else {
    $("web_qr_login").style.height = $("web_login").offsetHeight + "px"
  }
}, qrlogin_submit: function () {
  var A = pt.plogin.getSubmitUrl("ptqrlogin");
  $.winName.set("login_href", encodeURIComponent(pt.ptui.href));
  $.http.loadScript(A);
  return
}, force_qrlogin: function () {
}, no_force_qrlogin: function () {
}, redirect: function (B, A) {
  switch (B + "") {
    case"0":
      location.href = A;
      break;
    case"1":
      top.location.href = A;
      break;
    default:
      top.location.href = A
  }
}};
pt.plogin.auth();
function ptuiCB(H, K, B, F, C, A) {
  var J = pt.plogin.at_accout && $("p").value;
  clearTimeout(pt.plogin.loginClock);
  function D() {
    if (pt.plogin.is_mibao(B)) {
      B += ("&style=" + pt.ptui.style + "&proxy_url=" + encodeURIComponent(pt.ptui.proxy_url))
    }
    pt.plogin.redirect(F, B)
  }

  if (J) {
    pt.plogin.lastCheckAccout = ""
  }
  pt.plogin.hasSubmit = true;
  switch (H) {
    case"0":
      if (!J && !pt.plogin.is_mibao(B)) {
        window.clearInterval(pt.plogin.qrlogin_clock);
        D()
      } else {
        D()
      }
      break;
    case"3":
      $("p").value = "";
      pt.plogin.domFocus($("p"));
      pt.plogin.passwordErrorNum++;
      if (K == "101" || K == "102" || K == "103") {
        pt.plogin.showVC()
      }
      pt.plogin.check();
      break;
    case"4":
      if (pt.plogin.vcFlag) {
        pt.plogin.changeVC()
      } else {
        pt.plogin.showVC()
      }
      try {
        $("verifycode").focus();
        $("verifycode").select()
      } catch (G) {
      }
      break;
    case"65":
      pt.plogin.set_qrlogin_invalid();
      return;
    case"66":
      return;
    case"67":
      pt.plogin.go_qrlogin_step(2);
      return;
    case"10005":
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
  if (H == "10005" || H == "12" || H == "51") {
    pt.plogin.show_err(C, true)
  } else {
    if (H != 0 && J) {
      pt.plogin.show_err(C)
    }
  }
  if (!pt.plogin.hasCheck && J) {
    pt.plogin.showVC();
    $("verifycode").focus();
    $("verifycode").select()
  }
  if (Math.random() < 0.2) {
    pt.plogin.isdTime["7808-7-2-1"] = new Date().getTime();
    var E = 1;
    if (pt.ptui.isHttps) {
      E = 2
    }
    var I = "flag1=7808&flag2=7&flag3=2&" + E + "=" + (pt.plogin.isdTime["7808-7-2-1"] - pt.plogin.isdTime["7808-7-2-0"]);
    $.report.simpleIsdSpeed(I)
  }
}
function ptui_checkVC(A, C, B) {
  clearTimeout(pt.plogin.checkClock);
  pt.plogin.saltUin = B;
  pt.plogin.checkRet = A;
  if (!B) {
    pt.plogin.RSAKey = true
  } else {
    pt.plogin.RSAKey = false
  }
  if (A == "2") {
    pt.plogin.show_err(pt.str.inv_uin)
  } else {
    if (A == "3") {
    } else {
      if (!pt.plogin.hasSubmit) {
        pt.plogin.hide_err()
      }
    }
  }
  switch (A + "") {
    case"0":
    case"2":
    case"3":
      if (pt.ptui.pt_vcode_v1 == "1") {
        pt.plogin.needShowNewVc = false
      }
      pt.plogin.hideVC();
      $("verifycode").value = C || "abcd";
      pt.plogin.needVc = false;
      $.report.monitor("330321", 0.05);
      break;
    case"1":
      pt.plogin.cap_cd = C;
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
function ptui_auth_CB(C, B) {
  switch (parseInt(C)) {
    case 0:
      pt.plogin.authUin = $.cookie.get("superuin").replace(/^o0*/, "");
      pt.plogin.authSubmitUrl = B;
      pt.plogin.init(B);
      break;
    case 1:
      pt.plogin.init();
      break;
    case 2:
      var A = B + "&regmaster=" + pt.ptui.regmaster + "&aid=" + pt.ptui.appid + "&s_url=" + encodeURIComponent(pt.ptui.s_url);
      if (pt.ptui.pt_light == "1") {
        A += "&pt_light=1"
      }
      pt.plogin.redirect(pt.ptui.target, A);
      break;
    default:
      pt.preload.init()
  }
};