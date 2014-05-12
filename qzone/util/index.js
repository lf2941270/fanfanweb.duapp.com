function eachArray(arr,callback){
	for(var i= 0,len=arr.length;i<len;i++){
		if(callback(i,arr[i])){
			break;
		};
	}
}

/*接收两个obj类型的参数，返回一个obj，作用类似于jquery的 $.extend 的简化版 */
function extend(target,object){
  for(var i in object){
    target[i]=object[i];
  }
  return target;
}
/*测试代码
var targ={
  name:'lifan',
  age:25,
  sex:'male'
}
var obj={
  name:'test',
  phone:'18672394283'
}
console.log(extend(targ,obj));*/

/*将驼峰法命名转换为‘-’形式的命名*/
function camelCaseParse(name){
  var arr=name.split('');
  var regexp=/[A-Z]/g;
  for(var i= 1,len=arr.length;i<len;i++){
    if(regexp.test(arr[i])){
      arr[i]='-'+arr[i].toLowerCase();
    }
  }
  return arr.join('');
}


exports.eachArray=eachArray; /*遍历数组的函数*/
exports.extend=extend;
exports.camelCaseParse=camelCaseParse;/*将驼峰法命名转换为‘-’形式的命名*/