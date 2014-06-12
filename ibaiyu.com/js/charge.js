$(document).ready(function(){
    function setPayType(){
      $("#PayType").val($(".menu-y").find(".cur").attr("data-value"));
    }
    setPayType()
    //充值中心页面创建Tab布局
    $(".charge-con").createTabBox({
        event:"click",
        trigger:".menu-y li",
        container:".main .bd",
        share:true,
        //每一次tab切换后都会执行的回调函数
        callback:function(){
            setPayType();
            typeInit.apply($("input[name='type']"));
            initHeight();
        }
    });
    //充值中心左边竖导航鼠标划过动画
    $.createRailAnimate(".nav-left .menu-y","li",".cur",".navLabel",false);
    //设置外层容器高度，不然左边无法自适应高度
    function initHeight(){
        $(".charge-con").css("height",$(".charge-con").find(".main").outerHeight());
    }
    //给单选表单添加hover和checked等增强效果
    function radioInit(){
        $(this).each(function(){
            if($(this).attr("checked")=="checked"){
                $(this).next("label").addClass("checked").parent().siblings().find("label").removeClass("checked");
            }else{
                $(this).next("label").removeClass("checked");
            }
        })

    }
    function radio(){
      $(":radio").each(function(){
        radioInit.apply(this);
      }).hover(function(){
            $(this).next("label").addClass("hover");
          },function(){
            $(this).next("label").removeClass("hover");
          }).on("change",function(){
            radioInit.apply(this);
          }).next("label").hover(
          function(){
            $(this).addClass("hover");
          },function(){
            $(this).removeClass("hover");
          }
      );
    }
    radio();
    //选择游戏的交互
    //点击选择充值的游戏按钮选择游戏的框弹出，选择游戏后，改变该按钮上的文字为选择的游戏，然后弹出选择服务器的框
    function ChooseGame(){
        var _=this;
        this.gameid=false;
        this.gameBtn=$(".choose-game");
        this.serverBtn=$(".choose-server");
        this.gameBox=$(".game-box");
        this.serverBox=$(".server-box");
        this.radio=$(".choose-box").find(":radio");
        this.gameloaded=0;//游戏列表加载状态：0表示未加载，1表示加载中，2表示已加载，3表示加载失败
        this.init=function(){
            this.radio.each(function(){
                if($(this).attr("checked")==="checked"){
                    _.radioChoose(this);
                    if($(this).attr("name")==="game"){
                        _.gameid=$(this).attr("value");
                        _.loadServerList( _.gameid);
                    }
                }
            });
            this.event();
        }
        this.radioChoose=function(me){
            $(me).parents(".choose-box").fadeOut().prev().prev().text($(me).next().text());
        }
        this.loadGames=function(){
          _.gameLoaded=1;
          var html='加载中...'
          $(".game-box .box").empty().append(html);
          $.ajax({
            url:'/ibaiyu/admin/Servers/SdPay.ashx?method=GetGames',
            success:function(data){
              _.gameloaded=2;
              var data=JSON.parse(data);
              var html='';
              for(var i= 0,len=data.length;i<len;i++){
                html+='<a><input type="radio" name="game" id="game'+data[i].Id+'" value="'+data[i].Id+'"><label for="game'+data[i].Id+'">'+data[i].Name+'</label></a>'
              }
              $(".game-box .box").empty().append(html);
              radio();
            },
            error:function(){
              _.gameloaded=3;
              var html="游戏列表加载失败";
              $(".game-box .box").empty().append(html);
            }
          })
        }
        //根据传入的游戏id从服务器加载该游戏的服务器列表，并更新服务器选择弹出框里面的内容
        this.loadServerList=function(id){

          var html='加载中...'
          $(".server-box .box").empty().append(html);
          $.ajax({
            url:'/ibaiyu/admin/Servers/SdPay.ashx?method=GetServers&GameId='+id,
            success:function(data){
              var data=JSON.parse(data);
              var html='';
              for(var i= 0,len=data.length;i<len;i++){
                html+='<a><input type="radio" name="server" id="server'+data[i].Id+'" value="'+data[i].Id+'"><label for="server'+data[i].Id+'">'+data[i].Name+'</label></a>'
              }
              $(".server-box .box").empty().append(html);
              radio();
            },
            error:function(){
              var html="服务器列表加载失败";
              $(".server-box .box").empty().append(html);
            }
          })
        }
        this.event=function(){
            this.gameBtn.bind('click',function(){
                _.serverBox.fadeOut();
                _.gameBox.fadeIn();
                if(_.gameloaded===0||_.gameloaded===3){
                  _.loadGames();
                }
            });

            $(".game-box :radio").live('change click',function(){
                _.radioChoose(this);
                _.gameid=$(this).attr("value");
                //根据当前选中的value从服务器载入服务器列表
                $(".choose-server").text("选择游戏服务器");
                _.loadServerList( _.gameid);
                _.serverBox.fadeIn();
            });
            $(".choose-box a").live("click",function(){
                _.radioChoose($(this).find(":radio"));
                if($(this).parent().hasClass("game-box")){
                    _.serverBox.fadeIn();
                }
            });
            this.serverBtn.click(function(){
                if(!_.gameid){
                    $.showErr("请先选择要充值的游戏哦！");
                }else{
                    _.gameBox.fadeOut();
                    _.serverBox.fadeIn();
                }
            });
            $(document).click(function(e){
                if($(e.target).closest(".choose-box").length===0&&$(e.target).closest(".choose-btn").length===0){
                    $(".choose-box").fadeOut();
                }
            });
        }

        this.init();
    }
    new ChooseGame();
    //选择“充值到百娱币”时隐藏下面的选择游戏一栏
    function typeInit(){
        //当点击左边菜单切换到百娱币充值时，自动选择充值到游戏
        if($(".menu-y").find(".cur").index()===1){
            $(this).each(function(){
                if($(this).attr("value")==1){
                    $(this).attr("checked","checked");
                    radioInit.apply($(":radio"));
                }
            })
        }
        //如果充值类型为充值到百娱币，则隐藏选择游戏栏
        $(this).each(function(){
            if($(this).attr("checked")==="checked"){
                if($(this).attr("value")==2){
                    $(".choose").hide();
                    //设置外层容器高度，不然左边无法自适应高度
                    initHeight()
                }else{
                    $(".choose").show();
                    //设置外层容器高度，不然左边无法自适应高度
                    initHeight()
                }
            }
        })
    }
    typeInit.apply($("input[name='type']"));
    $("input[name='type']").change(function(){
       typeInit.apply(this);
    });
    //其他金额被选中时对应的输入框获得焦点
    $("#moneyother").change(function(){
        if($(this).attr("checked")==="checked"&&$("#other").attr("focus")!=="focus"){
            $("#other").trigger("focus");
        }
    });
    //当其他金额输入框获得焦点时，让其他金额被选中
    $("#other").focus(function(){
        if($("#moneyother").attr("checked")!=="checked"){
            $("#moneyother").attr("checked","checked").trigger("change");
        }
    }).change(function(){
          $("#moneyother").val($(this).val());
    });
    //选择银行的交互
    $(".bank-list").find("li").click(function(){
        $(this).addClass("select").find("input").attr("checked","checked").end().siblings().removeClass("select");
    }).hover(function(){
            $(this).addClass("hover");
        },function(){
            $(this).removeClass("hover");
        });
});