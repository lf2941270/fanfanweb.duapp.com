var lastReplyTime=0;//最近评论的一条说说的发布时间
var temp=0;//存储每次刷新出的说说列表中第一条说说的发布时间
var Shuo=require('./shuo');
module.exports=function(value,firstFlag,lastFlag){
  if(firstFlag){
    temp=value.abstime;
  }
  if(lastFlag){
    lastReplyTime=temp;
  }
	if(value.abstime<=lastReplyTime){
		lastReplyTime=temp;
    if(firstFlag){
      console.log('哎呦，还没有新说说。。。')
    }
		return true;
	}
  var shuo=new Shuo(value);
	shuo.like();
}