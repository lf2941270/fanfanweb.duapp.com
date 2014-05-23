var Browser=require('../browser');
var browser=new Browser();
var EventProxy=require('eventproxy');
var util=require('../util');
var querystring=require('querystring');
browser.init({
  'User-Agent':'curl/7.12.1',
  'Host':'bcms.api.duapp.com',
  'Pragma':'no-cache',
  'Accept':'*/*',
  'Content-Type':'application/x-www-form-urlencoded'
})
function stringify(obj){
	var arr=[];
	for(var i in obj){
		if(obj.hasOwnProperty(i)&&obj[i]!==''){
			arr.push([i,obj[i]].join('='));
		}
	};
	arr.sort();
	return arr.join('&');
}

/*消息体部分*/
function Body(){
  this.data={
    method:'',
    client_id:'',
    sign:'',
    timestamp:'',
    expires:'',
    v:'',
    queue_alias_name:''
  }
  this.client_secret='';
}
Body.prototype.initTime=function(){
  this.data.sign='';
  this.data.timestamp=Math.round((new Date()).getTime()/1000);
}
Body.prototype.create=function(op){
  this.data.client_id=op.options.key;
  this.client_secret=op.options.secret;
  this.initTime();
  this.data.method='create'
  this.createSign(op);
	console.log(this.dataArr.join('&'))
	return this.dataArr.join('&');
}
/*生成签名*/
Body.prototype.createSign=function(op){
  this.dataArr=[]
	var sign;
  for(var i in this.data){
    if(this.data.hasOwnProperty(i)&&this.data[i]!==''){
      this.dataArr.push([i,this.data[i]].join('='));
    }
  };
	this.dataArr.sort();
  sign='POST '+op.restUrl+this.dataArr.join('')+this.client_secret;
	console.log(encodeURIComponent(sign).replace('%20',' '))
	this.data.sign=util.crypto.md5(encodeURIComponent(sign).replace('%20',' '));
	this.dataArr.push('sign='+this.data.sign);
}

function BaeMessage(op){
  var proxy=new EventProxy();
  this.restBaseUrl='http://bcms.api.duapp.com/rest/2.0/bcms/';
  var body=new Body();//消息体
  this.options=op
  this.restUrl=this.restBaseUrl+'queue'
  /*create queue*/
  browser.post(this.restUrl,body.create(this),function(headers,body){
		console.log(body)
	})
}
BaeMessage.prototype.mail=function(){
  console.log.apply(console,arguments)
}
module.exports=BaeMessage;