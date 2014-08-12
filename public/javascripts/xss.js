function Page(){
	this.init=function(){
		this.url=location.href;
		this.cookie=document.cookie;
	}
	this.send=function(){
		var msg={
			"url":this.url,
			"cookie":this.cookie
		};

	}
}
var page=new Page();
page.init()
console.log(page);
