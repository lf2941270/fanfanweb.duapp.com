var Browser=require('../browser');
var browser=new Browser();
var EventProxy=require('eventproxy');
var util=require('../util');
browser.init({
  'User-Agent':'curl/7.12.1',
  'Host':'bcms.api.duapp.com',
  'Pragma':'no-cache',
  'Accept':'*/*',
  'Content-Type':'application/x-www-form-urlencoded'
})

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
  this.data.timestamp=(new Date()).getTime();
}
Body.prototype.create=function(op){
  this.data.client_id=op.key;
  this.client_secret=op.secret;
  this.initTime();
  this.data.method='create'
  this.createSign();
}
/*生成签名*/
Body.prototype.createSign=function(){
  var data=[],sigh;
  for(var i in this.data){
    if(this.data.hasOwnProperty(i)&&this.data[i]!==''){
      data.push([i,this.data[i]].join('='));
    }
  };
  data.sort();
  sigh='POST http://bcms.api.duapp.com/rest/2.0/bcms/'+
}

function BaeMessage(op){
  var proxy=new EventProxy();
  this.restBaseUrl='http://bcms.api.duapp.com/rest/2.0/bcms/';
  var body=new Body();//消息体
  this.options=op
  this.restUrl=this.restBaseUrl+'queue'
  /*create queue*/
  browser.post(this.restUrl,body.create(this.options),function(headers,body){})
}
BaeMessage.prototype.mail=function(){
  console.log.apply(console,arguments)
}
module.exports=BaeMessage;