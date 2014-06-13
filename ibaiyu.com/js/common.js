/*------------------------检测浏览器版本低于IE8提示用户升级------------------------------*/
if ( $.browser.msie&&parseInt($.browser.version)<8){
    $(document).empty();
    alert("什么，你还在使用IE"+$.browser.version+"？\n赶快升级到IE8及以上版本的浏览器吧！\n或者更换为Firefox,Chrome等高级浏览器获得更好的浏览效果！")
}
/*------------------------加入收藏支持IE,firefox,opera三个浏览器，chrome还是不兼容------------------------------*/
jQuery.fn.addFavorite = function(l, h) {
    return this.click(function() {
        var t = jQuery(this);
        if(jQuery.browser.msie) {
            window.external.addFavorite(h, l);
        } else if (jQuery.browser.mozilla || jQuery.browser.opera) {
            t.attr("rel", "sidebar");
            t.attr("title", l);
            t.attr("href", h);
        } else {
            alert("请使用Ctrl+D将本页加入收藏夹！");
        }
    });
};
function AddFavorite(sURL, sTitle,t)
{
    try
    {
        window.external.addFavorite(sURL, sTitle);
    }
    catch (e)
    {
        try
        {
            window.sidebar.addPanel(sTitle, sURL, "");
        }
        catch (e)
        {
            try{
                $(t).attr("rel", "sidebar");
                $(t).attr("title", sTitle);
                $(t).attr("href", sURL);
            }
            catch (e){
                console.log(e)
                $.showErr("加入收藏失败，请使用Ctrl+D进行添加");
            }
        }
    }
}
/*------------------------设为首页------------------------------*/
function SetHome(obj,vrl){
    try{
        obj.style.behavior='url(#default#homepage)';obj.setHomePage(vrl);
    }
    catch(e){
        try{
            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage',vrl);
        }
        catch (e){
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }
            catch (e) {
                $.showErr("此操作无法进行，请手动设置");
            }
        }
    }
}
/*------------------------对jquery进行一些扩展------------------------------*/
(function($,f){
    /*****************创建一个自定义弹出窗口，带有半透明遮罩*******************/
    var Popup=function(){
        var _=this;
        this.shade=f;
        this.box=f;
        this.popbd=f;
        this.w=f;
        this.h=f;
        this.options={
            speed:400,
            hideOthers:false,//设置为true时适用于弹出框内有多页内容，需要隐藏其余的
            showIndex:0,//与上一个设置为true时配合使用，表示要显示的那一项的索引值
            ownClose:f
        }
        this.init=function(me,o){
            this.options= $.extend(this.options,o);
            this.box=me;
            this.setup();
            return this;
        }
        this.setup=function(){
            _.box.addClass("pop-con con");
            if(_.box.find(".pop-bd").length==0){
                _.popbd=_.box.children().wrapAll("<div class='pop-bd'></div>").parent();
            }else{
                _.popbd=_.box.find(".pop-bd");
            }
            if(_.options.hideOthers===true){
                _.popbd.children().eq(_.options.showIndex).show().siblings().hide();
            }
            var hd="<div class=\"pop-hd\"><h2>"+ _.options.title+"</h2></div>"
            if(_.box.find(".pop-hd").length==0){
                _.box.prepend(hd);
            }
            this.w=parseInt(this.box.outerWidth());
            this.h=parseInt(this.box.outerHeight());
            if($("#shade").length==0){
                _.shade=$(document.createElement("div")).attr("id","shade").appendTo(document.body);
            }else{
                _.shade=$("#shade");
            }
            if(_.box.find(".close").length==0){
                $("<div class=\"close\" title='关闭'></div>").appendTo(_.box);
            }
            _.pos();
            _.on();
            _.event();
        }
        this.pos=function(){
            _.box.css({
                "top":($(window).height()-_.h)/2,
                "left":($(window).width()-_.w)/2
            });
        }
        this.on=function(){
            _.shade.show();
            _.box.fadeIn(_.options.speed);
        }
        this.off=function(){
            _.shade.hide();
            _.box.fadeOut(_.options.speed);
        }
        this.event=function(){
            $(window).resize(_.pos);
            $(document).keydown(function(e){
                if(e.which==27){
                    _.off();
                }
            });
            _.box.find(".close").click(_.off);
            //如果自定义的关闭按钮不为空，那么点击这个按钮时也执行关闭
            if(_.options.ownClose!==false){
                _.box.find(_.options.ownClose).click(_.off);
            }
        }
    }
    $.fn.popup=function(o){
        var me=$(this);
        (new  Popup()).init(me,o);
        return this;
    }

    /*创建一个显示错误信息的函数*/
    $.showErr=function(msg){
        function createRandName(){
            return "r"+(new Date()).getTime().toString(15)+Math.random().toString().substr(15);
        }
        $(".error-msg").remove();
        var name=createRandName(),
            pop=$("<div class='"+name+" pop-con error-msg'><p><i></i>"+msg+"<span title='关闭'>人家知道鸟^_^</span></p></div> ").appendTo(document.body),
            style=$('<style type="text/css">' +
                '.error-msg p{padding: 15px;min-width: 200px; text-align: center;font-size: 14px;font-weight:bold;color: #E2440C;position:relative;}' +
                '.error-msg p i{background: url("images/user/note_12.gif") no-repeat scroll 0 0;display: inline-block;height: 23px; width:26px;position:relative;top:3px;margin-right:4px;}' +
                '.error-msg p span{display:block;width:99px;height:22px;line-height:24px;font-size:12px;color:#4e4332; font-weight:normal;margin:15px auto 0;background:url("images/icon.png") 0 -22px no-repeat;cursor:default;}' +
                '.error-msg p span:hover{background-position:0 0px;}' +
                '</style> ');
        //判断样式是否被加载过，如果没有加载则加载并将设置标示符为已加载
        if($.errStyleLoad!==true){
            style.appendTo(document.body);
            $.errStyleLoad=true;
        }
        pop.popup({"title":"出错啦","ownClose":"span"});
    }
})(jQuery,false);
(function($,f){
    /*加载一个CSS文件*/
    $.loadCss=function(src){
        var hasLoaded=false;//判断样式表是否被加载过的标示符
        $("link").each(function(){
            if($(this).attr("href")==src){
                hasLoaded=true;
                return;
            }
        });
        if(!hasLoaded){
            var css=document.createElement("link");
            css.rel="styleSheet";
            css.href=src;
            css.type="text/css";
            document.body.appendChild(css);
        }
    }
    /*从地址栏地址中读取参数的值*/
 

    $.getParmFromHref=function(parm){
        var search,
            value="";
        if($(document).data("search")){
            search=$(document).data("search").split("&");
        }else{
            search=window.location.search.substr(1).split("&");
        }
        $.each(search,function(){
            if(this.indexOf(parm+"=")===0){
                value=this.substr(this.indexOf("=")+1);
                return;
            }
        })
        return value;
    }
    /*给地址栏设置一个参数*/
    $.setParmOfHref=function(par,val){
        var search,
            flag=false;
        //为了防止每次设置参数都因改变地址栏地址而刷新页面，将改变后的参数用jquery的data方法保存到$(document)中，下次读取参数时，先检测是否设置了data
        if($(document).data("search")){
            search=$(document).data("search").split("&");
        }else{
            search=window.location.search.substr(1).split("&");
        }
        $.each(search,function(i){
            if(this.indexOf(par+"=")===0||this.length===0){
                search[i]=par+"="+val;
                flag=true;
                return;
            }
        })
        if(!flag){
            search.push(par+"="+val);
        }
        search=search.join("&");
        $(document).data("search",search);
        return search;
    }
    /*----------------创建导航栏上滑动条动画的函数----------------*/
    //par是父元素,chi是子元素，cur是当前元素，navLabel是滑动条，horizontal接収一个布尔值，表示是否水平,length表示导航项目的个数，默认为子元素个数减去1
    $.createRailAnimate=function(parrent,children,current,navL,hori,length){
        var menu=$(parrent),
            li=menu.children(children),
            cur=menu.find(current),
            index,
            navLabel=menu.find(navL),
            horizontal=hori,
            len=length,
            size,
            padding,
            defValue,
            defNowValue,
            ani;
        function init(){
            cur=menu.find(current);
            index=cur.index();
            defValue=size*index+padding;
            if(!len){
                len=li.length-1;
            }
        }
        if(horizontal===true){
            size=cur.width();
            padding=parseInt(menu.css("padding-left"));
        }else{
            size=cur.height();
            padding=parseInt(menu.css("padding-top"));
        }
        init();
        navLabel.css((horizontal===true?"left":"top"),defValue);
        li.hover(function(){
            defNowValue=$(this).index()*size+padding;
            var i=$(this).index();
            if(i<len){
                flag=false;
                if(horizontal===true){
                    ani={
                        left:defNowValue
                    }
                }else{
                    ani={
                        top:defNowValue
                    }
                }
                navLabel.stop().animate(ani, 300);
            }else{
                navLabel.stop()
            }
        },function(){
            init();
            if(horizontal===true){
                ani={
                    left:defValue
                }
            }else{
                ani={
                    top:defValue
                }
            }
            navLabel.stop().animate(ani, 300);
        });
    }
    /*--------------------------创建一个tab布局的对象---------------------------*/
    var tabBox=function(){
        var _=this;
        //默认设置
        this.options={
            event:"click",
            trigger:".switch .s",
            container:f,//设置tab内容的父元素，默认为trigger的父元素的紧邻兄弟元素的子元素
            share:f,//各个tab内容中是否需要共享一些内容的标志位，为了充值中心页面添加
            callBack:f//一个可选的回调函数，在执行完切换操作后执行
        }
        this.init=function(box,options){
            this.box=box;
            this.tabNum= $.getParmFromHref("tabNum");
            this.options= $.extend(this.options,options);
            this.s=this.box.find(this.options.trigger);
            if(!_.options.container){
                this.container=this.s.parent().next().children();
            }else{
                this.container=this.box.find(_.options.container).children();
            }
            this.setup();
            return this;
        }
        this.doInit=function(index){
            _.s.eq(index).addClass("cur").siblings().removeClass("cur");
            if(!_.options.share){
                _.container.eq(index).show().siblings().hide();
            }else{
                _.container.hide().each(function(){
                    //在标签中添加“data-show”属性，里面写上要在哪个index中显示，中间用“,”分隔开
                    if($(this).attr("data-show")){
                      var arr=$(this).attr("data-show").split(","),
                          that=$(this);
                      $.each(arr,function(){
                        if(parseInt(this)===index){
                          that.show();
                        }
                      });
                    }

                });
            }
            //将当前的tabNum存储到document中便于翻页操作后使用
            $(document).data("tabNum",index);
            //如果传入了回调函数执行
            if($.isFunction(_.options.callback)){
                _.options.callback(_);
            }
        }
        this.setup=function(){
            if(this.tabNum!==""){
                _.doInit(this.tabNum);
            }else{
                _.doInit(0);
            }
            this.s.bind(this.options.event,
                function(){
                    var index=$(this).index();
                    _.doInit(index);
                })
        }
    }
    $.fn.createTabBox=function(o){
        return this.each(
            function(){
                var me=$(this);
                (new tabBox()).init(me,o);
            }
        )
    }
    /*创建一个侧栏和主体部分高度不等但是先滚动到底部的部分可以等待另一部分的交互效果对象*/
    var ScroolToBottom=function(){
        var _=this;
        this.options={
            left:".left",
            right:".center"
        }
        this.low=f;
        this.high=f;
        this.init=function(box,options){
            this.options= $.extend(this.options,options)
            this.box=box;
            this.offsetTop=this.box.offset().top;
            this.winHeight=$(window).height();
            this.left=this.box.find(this.options.left);
            this.right=this.box.find(this.options.right);
            this.left.h=this.left.outerHeight();
            this.right.h=this.right.outerHeight();
            if(this.left.outerHeight()<=this.right.outerHeight()){
                this.low=this.left;
                this.high=this.right;
            }else{
                this.low=this.right;
                this.high=this.left;
            }
            this.setup();
            return this;
        }
        this.setup=function(){
            $(window).resize(function(){
                _.resize();
            });
            $(window).scroll(function(){
                _.scroll();
            });
        }
        this.resize=function(){
            this.winHeight=$(window).height();
        }
        this.scroll=function(){
            if($(window).scrollTop()+this.winHeight>=this.offsetTop+this.low.outerHeight()&&$(window).scrollTop()+this.winHeight<=this.offsetTop+this.high.outerHeight()){
                var r=($(window).width()-this.low.parent().width())/2;
                this.low.css({position:"fixed",bottom:"0"})
                if(this.left.outerHeight()>this.right.outerHeight()){
                    this.low.css({"right":r})
                }
            }
            else if($(window).scrollTop()+this.winHeight<this.offsetTop+this.low.outerHeight()){
                this.low.css({position:"static",marginTop:"0"})
            }
            else{
                this.low.css({position:"static",marginTop:this.high.outerHeight()-this.low.outerHeight()})
            }
        }
    }
    $.fn.createScrollToBotom=function(o){
        return this.each(
            function(){
                var me=$(this);
                (new ScroolToBottom()).init(me,o);
            }
        );
    }

    /*显示下一步和上一步*/
    $.fn.nextStep=function(){
        $(this).hide().next().show();
    }
    $.fn.prevStep=function(){
        $(this).hide().prev().show();
    }
})(jQuery,false);

(function($,f){
    if(!$){return f};
    /*创建根据html内设置自动初始化的widget小插件*/
    //第一个功能，倒计时后跳转到一个链接
    var Widget=function(me,type,o){
        //不安全的eval格式化json串方法，需改进
        var options= eval("("+o+")");
        switch (type){
            case "timecount":
                (new Timecount(me,options)).init();
                break;
        }
        return this;
    }
    var Timecount=function(me,o){
        var _=this;
        this.con=me;
        this.timer=f;
        this.count=f;
        this.options={

        }
        this.init=function(){
            this.options= $.extend(this.options,o);
            this.refresh();
            this.setup();
            return this;
        }
        this.setup=function(){
            _.doit();
        }
        this.refresh=function(){
            _.count=parseInt(this.con.text());
        }
        this.doit=function(){
            _.timer=setTimeout(function(){
                if(_.count-1>0){
                    _.con.text(_.count-1);
                    _.refresh();
                    _.doit();
                }else{
                    location.href= _.options.link;
                }
            },1000);
        }
    }
    $.widget=function(){
        $(".widget").each(function(){
            //判断该元素是否执行过widget初始化，如果没有执行，就执行并将其标记为已执行
            if($(this).data("hasWidget")!==true){
                $(this).data("hasWidget",true);
                new Widget($(this),$(this).attr("widget-type"),$(this).attr("options"));
            }
        });
    }
})(jQuery,false);

$(document).ready(function(){

    (function(){
        /*最新开服鼠标划过切换效果*/
        $(".open_ser_box ul li").hover(function(){
            $(this).addClass("cur").siblings().removeClass("cur");
        });
        //创建导航条鼠标滑过动画
        $.createRailAnimate("#header .menu","li",".cur",".navLabel",true);
        $.createRailAnimate(".manage_box .switch","div",".cur",".navLabel",true);
        //创建Tab布局
        $(".manage_box").createTabBox();
        $(".news_box").createTabBox({event:"hover"});
        //创建左侧和右侧同时滚动到底部的交互
        $("#content").createScrollToBotom();
        /*分页跳转到输入框中的页码*/
        $(".pages").find(".goToPage").click(function(){
            $.setParmOfHref("tabNum",$(document).data("tabNum"))
            location.search=$.setParmOfHref("page",$(this).prev().val());
        });
    })();

    //登录框表单交互
    $(".input").focus(
        function(){
            $(this).addClass("focus");
        }
    ).blur(
        function(){
            $(this).removeClass("focus");
        }
    );
    /*对IE8及以下浏览器设置登陆框表单默认值*/
    /*判断浏览器版本为IE8及以下*/
    if ( $.browser.msie&&parseInt($.browser.version)<=8){
        var notice=$("<span class=\"notice\">请输入密码</span>");
        notice.click(function(){
            $(this).hide();
            $("#password").focus();
        }).appendTo($(".login form"));
        $("#username").val("请输入账号")
            .focus(function(){
                if($(this).val()=="请输入账号"){
                    $(this).val("");
                }
            })
            .blur(function(){
                if($(this).val()==""){
                    $(this).val("请输入账号");
                }
            }).parents("form")
            .find("#password").focus(function(){
                notice.hide();
            })
            .blur(function(){
                if($(this).val()==""){
                    notice.show()
                }
            })
    }
    /*提交表单时检测输入是否合法*/
    $(".login-box").submit(function(){
        var user=$(this).find("#username"),
            userVal=user.val(),
            regUser=/^[a-zA-Z]\w{5,15}$/gi,
            psd=$(this).find("#password"),
            psdVal=psd.val(),
            regPsd=/\w{6,16}/gi,
            errMsg=["账号不能为空",
                "账号格式不正确",
                "密码不能为空",
                "密码格式不正确",
                "账号或者密码不正确"
            ],
            data="uc_left1$txtname="+encodeURIComponent(userVal)+"&password="+encodeURIComponent(psdVal)+"&remember_me=false";
        if(userVal==""||userVal=="请输入账号"){
            user.trigger("focus");
            $.showErr(errMsg[0]);
            return false;
        }else if(!regUser.test(userVal)){
            user.trigger("focus");
            $.showErr(errMsg[1]);
            return false;
        }
        if(psdVal==""){
            psd.trigger("focus");
            $.showErr(errMsg[2]);
            return false;
        }else if(!regPsd.test(psdVal)){
            psd.trigger("focus");
            $.showErr(errMsg[3]);
            return false;
        }
    });
    //加入收藏,chrome还是不兼容
    $("#bookmark").addFavorite(document.title,location.href);
});