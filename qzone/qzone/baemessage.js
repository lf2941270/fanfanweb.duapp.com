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
  this.createSign(op.restUrl);
	return this.dataArr.join('&');
}
Body.prototype.mail=function(args,restUrl){
	this.initTime();
	this.data.method='mail';
	this.data.from=args[0];
	this.data.address=args[1];
	this.data.mail_subject=args[2];
	this.data.message=args[3];
	this.createSign(restUrl);
	return this.dataArr.join('&')
}
Body.prototype.drop=function(restUrl){
  this.initTime();
  this.data.method='drop';
  this.createSign(restUrl);
  return this.dataArr.join('&');
}
/*生成签名*/
Body.prototype.createSign=function(restUrl){
  this.dataArr=[]
	var sign;
  for(var i in this.data){
    if(this.data.hasOwnProperty(i)&&this.data[i]!==''){
      this.dataArr.push([i,this.data[i]].join('='));
    }
  };
	this.dataArr.sort();
  sign='POST'+restUrl+this.dataArr.join('')+this.client_secret;
	this.data.sign=util.crypto.md5(encodeURIComponent(sign));
	this.dataArr.push('sign='+this.data.sign);
}

function BaeMessage(op){
	this.options=op;
}
BaeMessage.prototype.init=function(){
	var self=this;
	this.proxy=new EventProxy();
	this.restBaseUrl='http://bcms.api.duapp.com/rest/2.0/bcms/';
	this.body=new Body();//消息体

	this.restUrl=this.restBaseUrl+'queue'
	/*create queue*/
	browser.post(this.restUrl,this.body.create(this),function(headers,body){
		var body=JSON.parse(body);
		console.log(body)
    if(body.response_params){
      self.queueName=body.response_params.queue_name;
    }else{
      self.queueName='aaaaaaaaaa';
      self.restUrl=self.restBaseUrl+self.queueName;
      return self.drop()
    }
		self.restUrl=self.restBaseUrl+self.queueName;
		self.proxy.emitLater('queueName');
	})
}
BaeMessage.prototype.drop=function(){
  var self=this;
  browser.post(self.restUrl,self.body.drop(self.restUrl),function(headers,body){
    console.log(body);
  })
}
BaeMessage.prototype.mail=function(from,to,title,content){
	this.init();
	var args=arguments;
	var self=this;
  this.proxy.on('queueName',function(){
		browser.post(self.restUrl,self.body.mail(args,self.restUrl),function(headers,body){
			console.log(body)
		})
	})
}
module.exports=BaeMessage;