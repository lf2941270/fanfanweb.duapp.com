function focusFunc(){var interv=3000;var interv2=10;var opac1=80;var source="focus";function getTag(tag,obj){if(obj==null){return document.getElementsByTagName(tag)}else{return obj.getElementsByTagName(tag)}};function getid(id){return document.getElementById(id)};var opac=0,j=0,t=63,num,scton=0,timer,timer2,timer3;var id=getid(source);id.removeChild(getTag("div",id)[0]);var li=getTag("li",id);var div=document.createElement("div");var title=document.createElement("div");var span=document.createElement("span");var button=document.createElement("div");button.className="button";for(var i=0;i<li.length;i++){var a=document.createElement("a");a.innerHTML=i+1;a.onclick=function(){clearTimeout(timer);clearTimeout(timer2);clearTimeout(timer3);j=parseInt(this.innerHTML)-1;scton=0;t=63;opac=0;fadeon()};a.className="b1";a.onmouseover=function(){this.className="b2"};a.onmouseout=function(){this.className="b1";sc(j)};button.appendChild(a)};function alpha(obj,n){if(document.all){obj.style.filter="alpha(opacity="+n+")"}else{obj.style.opacity=(n/100)}};function sc(n){for(var i=0;i<li.length;i++){button.childNodes[i].className="b1"};button.childNodes[n].className="b2"};title.className="num_list";title.appendChild(span);alpha(title,opac1);id.className="d1";div.className="d2";id.appendChild(div);id.appendChild(title);id.appendChild(button);var fadeon=function(){opac+=5;div.innerHTML=li[j].innerHTML;span.innerHTML=getTag("img",li[j])[0].alt;alpha(div,opac);if(scton==0){sc(j);num=-2;scrolltxt();scton=1};if(opac<100){timer=setTimeout(fadeon,interv2)}else{timer2=setTimeout(fadeout,interv)}};var fadeout=function(){opac-=5;div.innerHTML=li[j].innerHTML;alpha(div,opac);if(scton==0){num=2;scrolltxt();scton=1};if(opac>0){timer=setTimeout(fadeout,interv2)}else{if(j<li.length-1){j++}else{j=0};fadeon()}};var scrolltxt=function(){t+=num;span.style.marginTop=t+"px";if(num<0&&t>3){timer3=setTimeout(scrolltxt,interv2)}else if(num>0&&t<62){timer3=setTimeout(scrolltxt,interv2)}else{scton=0}};fadeon();}

$(function(){
	$('.tabTag li').click(function(){
		var eqNum = $(this).index();
		$(this).siblings('li').removeClass('current');
		$(this).addClass('current');
		$(this).parents('.serverbox').children('.tabGroup').children('.tabUnit').hide();
		$(this).parents('.serverbox').children('.tabGroup').children('.tabUnit').eq(eqNum).show();
	});
	$('.tabTag li:first').addClass('current');
	$('.tabUnit:first').show();

	$('.inputbox input').focus(function(){
		$(this).addClass('inputLive');
		$(this).siblings('.tips').show();
	}).blur(function(){
		$(this).removeClass('inputLive');
		$(this).siblings('.tips').hide();
	});

	$('.showLogbox').click(function(){$('.slideBox').animate({'margin-left':'-570px'},400);});
	$('.showRegbox').click(function(){$('.slideBox').animate({'margin-left':'0'},400);});
	$('.showServer').click(function(){
		$('.slideBox2').animate({'margin-left':'-708px'},400);
		$(this).hide();
		$('.showMain').show();
	});
	$('.showMain').click(function(){
		$('.slideBox2').animate({'margin-left':'-0'},400);
		$(this).hide();
		$('.showServer').show();
	});
	$('.showRegbox').click(function(){$('.slideBox').animate({'margin-left':'0'},400);});

	//$('.cardbox li:nth-child(2),.cardbox li:nth-child(3),.cardbox li:nth-child(4)')
	$('.cardbox li').hover(
		function(){
			$(this).css('z-index','10');
			$(this).children('.card').css('overflow','inherit');
			$(this).children('.info').children('.enter').slideDown(200);
			$(this).children('.card_cover').animate({'top':'-350px'},300);
			$(this).children('.shadow').animate({'bottom':'95px'},200);
		},
		function(){
			$(this).css('z-index','0');
			$(this).children('.card').css('overflow','hidden');
			$(this).children('.info').children('.enter').slideUp(200);
			$(this).children('.card_cover').animate({'top':'0'},300);
			$(this).children('.shadow').animate({'bottom':'1px'},200);
		}
	);
	$('.cardbox li:first').addClass('stillShow');

	$('.closeInfo').click(function(){$('.mask').hide()});
});

