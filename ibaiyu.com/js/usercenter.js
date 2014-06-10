/*----------------------扩展jquery创建多图轮播的函数----------------------*/
(function($, f) {
    if(!$) return f;
    var Slider=function(){
        //给内部函数访问this时使用
        var _=this;
        //con是最外层容器
        this.con=f;
        //u是轮播内容容器
        this.u=f;
        //l是轮播的单个内容
        this.l=f;
        //arrow是轮播两侧的箭头
        this.arrow=f;
        //dot是轮播底下的触点
        this.dots=f;
        //num是每个轮播页的内容个数
        this.num=f;
        //len是轮播页数
        this.len=f;
        //当前轮播的位置
        this.interval=f;
        this.current=0;
        this.options={
            num:3,
            time:5000,
            speed:300,
            trigger:"click"
        }
        this.init=function(me,ops){
            this.options= $.extend(this.options,ops);
            this.con=me;
            this.u=me.find("ul");
            this.l=this.u.find("li");
            this.arrow=me.find(".arrow");
            this.num=this.options.num;
            this.len=Math.ceil(this.l.length/this.num);
            this.w=(this.l.outerWidth()+parseInt(this.l.css("margin-left"))+parseInt(this.l.css("margin-right")))*this.num;
            this.setup();
            return this;
        }
        this.setup=function(){
            this.u.css({
                "width":this.w*this.len+"px",
                "left":0
            });
            if(this.len>1){
                this.arrow.show();
                this.dotsEvent();
                this.arrowClick();
                this.start();
                _.u.add(_.dots).add(_.arrow).hover(_.stop, _.start);
            }
        }
        this.dotsEvent=function(){
            _.dots=$(document.createElement("ol"));
            _.dots.addClass("dots");
            var dotsHtml="";
            for(var i=0;i< _.len;i++){
                dotsHtml+="<li></li>"
            }
            _.dots.append(dotsHtml);
            _.con.append(_.dots);
            _.dots.children().eq(0).addClass("cur");
            _.dots.children().bind(_.options.trigger,function(){
                _.move($(this).index());
            });
        }
        this.move=function(index){
            if(index<0){
                index=_.len-1;
            }
            if(index>_.len-1){
                index=0;
            }
            _.u.animate({"left":_.w*-index});
            this.current=index;
            _.dots.children().eq(index).addClass("cur").siblings().removeClass("cur");
        }
        this.arrowClick=function(){
            $(_.arrow).click(function(){
                if($(this).hasClass("prev")){
                    _.prev();
                }else{
                    _.next();
                }
            });
        }
        this.prev=function(){
            return _.move(_.current-1);
        }
        this.next=function(){
            return _.move(_.current+1);
        }
        this.start=function(){
            _.interval=setInterval(function(){
                _.next();
            }, _.options.time);
        }
        this.stop=function(){
            clearInterval(_.interval);
        }
    }
    $.fn.slider=function(o){
        return $(this).each(function(){
            var me=$(this);
            (new Slider()).init(me,o);
        });
    }
})(jQuery,false);

/*----------------------扩展jquery创建一个日期选择框----------------------*/
(function($, f) {
    if(!$) return f;
    var DateSelect=function(){
        //给内部函数访问this时使用
        var _=this;
        //申明对象属性
        this.input=f;//输入框
        this.pop=f;//弹出框
        this.selectDate=f;//要传送给后台的日期，不经常变化
        this.date=f;//存储当前选择框的日期
        this.y=f;//年
        this.m=f;//月
        this.d=f;//日
        this.today=new Date();
        //默认设置
        this.options={
            date:f
        }
        //初始化函数
        this.init=function(me,o){
            this.con=me;
            this.options= $.extend(this.options,o);
            _.date=new Date(_.options.date.split("-")[0],_.options.date.split("-")[1]-1,_.options.date.split("-")[2]);
            this.selectDate=this.date;
            this.dateInit();
            this.uiInit();
            this.setup();
            return this;
        }
        this.uiInit=function(){
            $.loadCss("css/date-pop.css");
            _.con.css({
                "position":"relative"
            });
            _.input=$('<input type="text" class="date-pop-input" value=""/>');
            _.input.appendTo(_.con).attr("value", _.y+"-"+(_.m+1)+"-"+ _.d);
            _.pop=$('<div class="date-pop"><i class="arrow-top"></i></div>');
        }
        this.dateInit=function(){
            _.y=_.date.getFullYear();
            _.m=_.date.getMonth();
            _.d=_.date.getDate();
        }
        this.MonInit=function(){
            _.dateInit();
            var lastMonth=new Date(new Date(_.date.setDate(1)).getTime()-1000*60*60*24);
            _.thisMonLastDate=(new Date((new Date(_.date.setMonth(_.m+1))).setDate(0))).getDate();
            _.preMonLastDate=lastMonth.getDate();//上个月最后一天的日期数
            _.preMonLastDay=lastMonth.getDay();
            _.preMonLastDay=(_.preMonLastDay==0?7:_.preMonLastDay)//上个月最后一天的星期数,1-7分别代表周一至周日
        }
        //启动函数
        this.setup=function(){
            _.MonInit();
            _.ui();
            _.event();
        }
        //事件函数
        this.event=function(){
            $(document).on('mousedown', function (e) {
                //如果在弹出层外面点击鼠标，那么隐藏弹出层
                if ($(e.target).closest('.date-pop').length === 0) {
                    _.pop.hide();
                }
            });
            _.con.click(function(){
                _.pop.show();
            });
            _.prevUI.click(function(){
                _.m-=1;
                _.update();
            })
            _.nextUI.click(function(){
                _.m+=1;
                _.update();
            })
            _.con.find(".day").mousedown(function(){
                if($(this).hasClass("old")){
                    _.m-=1;
                }else if($(this).hasClass("new")){
                    _.m+=1;
                }
                _.d=$(this).text();
                _.choose()
            });
            _.tFootUI.click(function(){
                _.date= _.today;
                _.dateInit();
                _.choose();
            });
        }
        //选中日期后的函数
        this.choose=function(){
            _.update()
            _.selectDate= _.date;
            _.input.attr("value", _.y+"-"+(_.m+1)+"-"+ _.d);
            _.highLight();
        }
        //选中的日期高亮
        this.highLight=function(){
            var inputArr=_.input.attr("value").split("-");
            if(inputArr[0]== _.y&&inputArr[1]== _.m+1){
                _.con.find(".day").each(function(){
                    $(this).removeClass("active");
                    if(!$(this).hasClass("new")&&!$(this).hasClass("old")&&$(this).text()== _.d){
                        $(this).addClass("active");
                    }
                })
            }
            if(_.y== _.today.getFullYear()&& _.m== _.today.getMonth()){
                _.con.find(".day").each(function(){
                    if(!$(this).hasClass("new")&&!$(this).hasClass("old")&&$(this).text()== _.today.getDate()){
                        $(this).addClass("today");
                    }
                })
            }
        }
        //更新函数
        this.update=function(){
            _.date=new Date(_.y, _.m, _.d);
            _.setup()
        }
        //UI函数
        this.ui=function(){
            _.pop.find("table").remove();
            _.table();
            _.pop.appendTo(_.con);
            _.highLight();
        }
        this.table=function(){
            _.tableUI=$('<table class="table-condensed"></table>');
            _.tHead();
            _.tBody();
            _.tFoot();
            _.tableUI.appendTo(_.pop)
        }
        this.tHead=function(){
            _.tHeadUI=$('<thead></thead>');
            _.prevUI=$('<th class="prev" style="visibility: visible;"><i class="icon-arrow-left"><</i></th>');
            _.switchUI=$('<th colspan="5" class="switch-date">'+ _.y+'年'+ (_.m+1)+'月</th>');
            _.nextUI=$('<th class="next" style="visibility: visible;"><i class="icon-arrow-right">></i></th>');
            var tr=$('<tr></tr>');
            tr.append(_.prevUI).append(_.switchUI).append(_.nextUI);
            tr.appendTo(_.tHeadUI);
            $('<tr><th class="dow">一</th><th class="dow">二</th><th class="dow">三</th><th class="dow">四</th><th class="dow">五</th><th class="dow">六</th><th class="dow">日</th></tr>').appendTo(_.tHeadUI);
            _.tHeadUI.appendTo(_.tableUI);
        }
        this.tBody=function(){
            _.tBodyUI=$("<tbody></tbody>");
            var text="";
            for(var i=1;i<=42;i++){
                if(i%7==1){
                    text+="<tr>"
                }
                if(i<=_.preMonLastDay){
                    text+='<td class="day old">'+(_.preMonLastDate-_.preMonLastDay+i)+'</td>'
                }else if(i>_.preMonLastDay&&i<=_.thisMonLastDate+_.preMonLastDay){
                    text+='<td class="day">'+(i- _.preMonLastDay)+'</td>'
                }else{
                    text+='<td class="day new">'+(i- _.thisMonLastDate-_.preMonLastDay)+'</td>';
                }
                if(i%7==0){
                    text+="</tr>"
                }
            }
            $(text).appendTo(_.tBodyUI);
            _.tBodyUI.appendTo(_.tableUI);
        }
        this.tFoot=function(){
            _.tFootUI=$('<tfoot><tr><th class="today" colspan="7">选择今天</th></tr></tfoot>');
            _.tFootUI.appendTo(_.tableUI);
        }
    }
    $.fn.dateSelect=function(o){
        return $(this).each(function(){
            var me=$(this);
            (new DateSelect()).init(me,o);
        });
    }
})(jQuery,false);
$(function(){
    //最近玩过的游戏初始化轮播
    $(".game-content").slider();
    //设置外层容器高度，不然左边无法自适应高度
    $(".user-con").css("height",$(this).find(".main").height());
    //点击修改头像按钮后弹出选择头像弹窗
    $("#change-face").click(function(){
        $(".change").popup({"title":"修改头像"});
    });
    //选择头像弹窗里面的交互
    $(".choose").find("li").click(function(){
        var index=$(this).index();
        $(this).addClass("cur").append("<i></i>").siblings().removeClass("cur").find("i").remove();
        $("#faceid").attr("value",index);
    }).eq($("#faceid").val()).addClass("cur").append("<i></i>");
    //站内信页面全选站内信
    $(".choose-all").toggle(function(){
        $(this).addClass("cancle-all").find("span").text("取消").parents("form").find("input:checkbox").attr("checked",true);
    },function(){
        $(this).removeClass("cancle-all").find("span").text("全选").parents("form").find("input:checkbox").attr("checked",false);
    });
    /*站内信页面点击消息标题弹出站内消息*/
    $(".msg-box").find(".sp3").click(function(){
        //此处还要加一个处理，向后台发送数据表示这条消息已经阅读过了
        var index=$(this).parent("dd").index()-1;
        var title=$(this).text();
        $(".msg-content").find(".msg-c").eq(index).popup({"title":title});
    });
    //充值记录页面创建Tab布局
    $(".check-box").createTabBox({event:"click"});
    $.createRailAnimate(".check-box .switch","div",".cur",".navLabel",true,2);
    //充值记录页面的日期选择部分
    function DateOfCheckPage(){
        var _=this;
        //取得格式化后的今日日期
        this.getNowDate=function(){
            var date=new Date();
            return this.formartDate(date);
        }
        //取得格式化后的上个月的今天的日期
        this.getLastMonth=function(){
            var date=new Date();
            date.setMonth(date.getMonth()-1);
            return this.formartDate(date);
        }
        //对日期进行格式化
        this.formartDate=function(date){
            var text=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
            return text;
        }
        this.init=function(){
            if($.getParmFromHref("startdate")!==""){
                $(".date-input").eq(0).dateSelect({
                    "date": $.getParmFromHref("startdate")
                }).nextAll(".date-input").dateSelect({
                        "date":$.getParmFromHref("enddate")
                    });
            }else{
                $(".date-input").eq(0).dateSelect({
                    "date":_.getLastMonth()
                }).nextAll(".date-input").dateSelect({
                        "date":_.getNowDate()
                    });

            }

        }
    }
    (new DateOfCheckPage()).init();
    $(".check-box .send-date").click(function(e){
        var startDate,
            endDate,
            dateinput=$(this).parent().find(".date-pop-input"),
            search;

        startDate=dateinput.eq(0).val();
        endDate=dateinput.eq(1).val();
        $.setParmOfHref("startdate",startDate);
        search=$.setParmOfHref("enddate",endDate);
        location.search=search;
        return false;
    });
    //安全设置页弹出窗口
    $("a.email").bind("click",function(){
        //如果为已绑定状态，则按钮不可用，直接return
        if($(this).hasClass("has-bind")){
            return;
        }
        $(".email-bind").popup({"title":"绑定邮箱"/*,"hideOthers":true,showIndex:2*/}).find(".step1").bind("submit",function(event){
            //先要判断邮箱地址是否合法,对不合法的地址进行错误提示

            //合法的邮件地址用ajax请求发送邮件，发送成功后调用nextStep跳转到下一步
            //如果发送失败显示服务器传来的错误原因
            $(this).nextStep();
            return false;
        }).end().find(".step2").find(".reSend").bind("click",function(){
                //重新发送邮件的操作

            }).end().find(".changeEmail").bind("click",function(){
                $(this).parents(".step2").prevStep();
            });
    });
    $("a.protect").bind("click",function(){
        if($(this).hasClass("has-bind")){
            return;
        }
        $(".protect-bind").popup({"title":"设置密保"}).find(".step1").bind("submit",function(event){
            //先判断所填问题答案是否为空
            //不为空的话向后台提交数据，提交成功后跳转到下一步

            $(this).nextStep();
            $.widget();
            return false;
        });
    });
    $("a.idcard").bind("click",function(){
        if($(this).hasClass("has-bind")){
            return;
        }
        $(".idcard-bind").popup({"title":"绑定身份证"}).find(".step1").bind("submit",function(event){
            //先判断所填姓名和身份证号格式
            //格式正确的话向后台提交数据，提交成功后跳转到下一步

            $(this).nextStep();
            $.widget();
            return false;
        });
    });
    //某个绑定操作成功弹出成功5秒后跳转的窗口，通过给地址栏加success=true实现并添加sucid来表示成功的操作
    //sucid=1表示邮件发送成功，sucid=2表示密保绑定成功，sucid=3表示身份证绑定成功
    if($.getParmFromHref("success")==="true"){
        switch ($.getParmFromHref("sucid")){
            case "1":
            {
                $(".email-bind").popup({"title":"绑定邮箱","hideOthers":true,showIndex:2});
                //调用widget()启动倒计时
                $.widget();
                break;
            }
        }
    }
    //用户中心页竖导航鼠标划过动画
    $.createRailAnimate(".nav-left .menu-y","li",".cur",".navLabel",false);
  //点击更换验证码图片
  $(".identi-img").click(function(){
    $(this).attr("src","http://www.ibaiyu.cn/tools/verify_code.ashx?r="+(Math.random().toString().substr(10))).prev().trigger("focus");
    return false;
  });
});