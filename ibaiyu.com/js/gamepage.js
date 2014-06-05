(function($,f){
    /*****************创建一个自定义弹出图片的窗口，带有半透明遮罩*******************/
    var ImgPopup=function(){
        var _=this;
        this.shade=f;
        this.box=f;
        this.url=f;
        this.w=f;
        this.h=f;
        this.options={
            speed:400
        }
        this.init=function(me,o){
            this.options= $.extend(this.options,o);
            this.url=me.find("img").attr("data-pic");
            this.setup();
            return this;
        }
        this.setup=function(){
           // <img src='"+me.find("img").attr("data-pic")+"'/>
            this.box=$("<div></div>");
            _.imgLoad(_.url,function(w,h){
                _.w=parseInt(_.box.outerWidth())-parseInt(_.box.width())+w;
                _.h=parseInt(_.box.outerHeight())-parseInt(_.box.height())+h;
                _.pos();
                $("<img src='"+ _.url+"'/>").appendTo(_.box);
            })
            _.box.addClass("pop-img").appendTo(document.body);
            _.w=parseInt(_.box.outerWidth());
            _.h=parseInt(_.box.outerHeight());
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
            _.box.remove();
        }
        this.event=function(){
            $(window).resize(_.pos);
            $(document).keydown(function(e){
                if(e.which==27){
                    _.off();
                }
            });
//            _.box.find("img").load(function(){
//
//                _.pos()
//            })
            _.box.find(".close").click(_.off);
            _.shade.click(_.off);
            //如果自定义的关闭按钮不为空，那么点击这个按钮时也执行关闭
            if(_.options.ownClose!==false){
                _.box.find(_.options.ownClose).click(_.off);
            }
        }
        this.imgLoad = function (url, callback) {
            var img = new Image();
            img.src = url;
            if (img.complete) {
                callback(img.width, img.height);
            } else {
                img.onload = function () {
                    callback(img.width, img.height);
                    img.onload = null;
                };
            };
        };
    }
    $.fn.imgPopup=function(o){
        var me=$(this);
        (new  ImgPopup()).init(me,o);
        return this;
    }
})(jQuery,false);

$(document).ready(function(){
    //初始化轮播
    if($('.slide_box').length!==0){
        $('.slide_box').unslider();
    }
    $(".fast-way").find("li").hover(function(){
        $(this).addClass("hover");
    },function(){
        $(this).removeClass("hover");
    });

    $(".server-list").createTabBox({event:"hover"});
    $(".screenshot").find("li").click(function(){
        $(this).imgPopup();
    });
});