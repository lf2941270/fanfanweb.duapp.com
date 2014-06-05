$(document).ready(function(){

    //充值中心页面创建Tab布局
    $(".about-con").createTabBox({
        event:"click",
        trigger:".menu-y li",
        container:".main",
        //每一次tab切换后都会执行的回调函数
        callBack:function(){

            initHeight();
            $.setParmOfHref("tabNum",$(document).data("tabNum"));
        }
    });
    //充值中心左边竖导航鼠标划过动画
    $.createRailAnimate(".nav-left .menu-y","li",".cur",".navLabel",false);
    //设置外层容器高度，不然左边无法自适应高度
    function initHeight(){
        $(".about-con").css("height",$(".about-con").find(".main").outerHeight());
    }
});



