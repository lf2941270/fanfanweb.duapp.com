function eachArray(arr,callback){
	for(var i= 0,len=arr.length;i<len;i++){
		if(callback(i,arr[i])){
			break;
		};
	}
}
exports.eachArray=eachArray; //遍历数组的函数