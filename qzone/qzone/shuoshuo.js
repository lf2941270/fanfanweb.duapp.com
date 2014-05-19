var lastReplyTime=0;//最近评论的一条说说的发布时间

module.exports=function(shuo,refreshTime,lastFlag){
	console.log('lastReplyTime:%s',lastFlag)
	if(shuo.abstime<=lastReplyTime){
		lastReplyTime=refreshTime;
		return true;
	}
	if(lastFlag){
		lastReplyTime=refreshTime;
	}
	console.log(shuo.abstime)
}