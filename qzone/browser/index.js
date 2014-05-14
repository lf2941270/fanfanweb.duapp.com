var util=require('../util');/*自定义的工具集*/
var url=require('url');
var request=require('./request');

function Browser(){}
Browser.prototype.init=function(options){
  /*默认设置*/
  var ops={
    'User-Agent':'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36',
    'Accept-Encoding':'gzip,deflate,sdch',
    'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Cache-Control':'max-age=0',
    'Proxy-Connection':'keep-alive',
    'cookie':''
  }
  if(options===undefined){
    options={};
  }
	this.headers=util.extend(ops,options);
	this.cookie=parseCookie(this.headers.cookie);
}

function eachCookie(arr,callback){
  util.eachArray(arr,function(index,value){
    util.eachArray(value.split(';'),function(deepIndex,deepValue){
      callback(deepIndex,deepValue);
    });
  });
}
function parseCookie(string){
	if(string===''){
		return {};
	}
	var obj={}
	util.eachArray(string.split(';'),function(key,value){
		obj[value.split('=')[0].trim()]=value.split('=')[1].trim();
	});
	return obj;
}
function stringifyCookie(obj){
	var arr=[];
	for(var i in obj){
		arr.push(i+'='+obj[i]);
	}
	return arr.join(';');
}
Browser.prototype.setCookie =function(value){
  var arr=value.split('=');
  if(arr.length>=2){
    this.cookie[arr.shift().trim()]=arr.join('=').trim();
  }
  this.headers.cookie=stringifyCookie(this.cookie);
}
/*对响应头进行处理*/
Browser.prototype.dealResponseHeaders =function(headers){
  var setCookieArr=headers['set-cookie'];
  this.dealSetCookie(setCookieArr);
}
Browser.prototype.dealSetCookie=function(setArr){
  var _=this;
  var whiteList=['expires','max-age','path','domain'];//一些直接忽视的cookie设置项
  eachCookie(setArr,function(deepIndex,deepValue){
    if(whiteList.indexOf(deepValue.split('=')[0].toLowerCase().trim())!==-1){
      return;
    }
    _.setCookie(deepValue);
  });
	this.headers.cookie=stringifyCookie(this.cookie);
}


Browser.prototype.get=function(href,callback){
	var _=this;
	var options=url.parse(href);
	options.method='get';
	var headers=util.extend(this.headers,options);
	request(headers,function(headers,body){
		Browser.prototype.dealResponseHeaders.bind(_)(headers);
    if(headers.location!==undefined){
      _.get(headers.location,callback);
    }else{
      callback(headers,body);
    }
	});
}
Browser.prototype.post=function(href,data,callback){
	var _=this;
	var options=url.parse(href);
	options.method='post';
	var headers=util.extend(this.headers,options);
	request(headers,data,function(headers,body){
		Browser.prototype.dealResponseHeaders.bind(_)(headers);
    if(headers.location!==undefined){
      _.get(headers.location,callback);
    }else{
      callback(headers,body);
    }
	});
}
module.exports=Browser;

/*
var browser=new Browser();
browser.init();
browser.get('http://qzone.qq.com',function(body){
	console.log(browser.headers)
	console.log("================Content===================");

//  console.log(body);
});
*/
