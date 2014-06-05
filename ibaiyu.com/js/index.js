$(document).ready(function(){


    //初始化登录页轮播
    if($('.slide_box').length!==0){
        $('.slide_box').unslider();
    }
    //热门游戏鼠标划过升高5像素以及显示弹出层
    $(".item_box").hover(function(){
        $(this).animate({top:"-5px"}).find(".popup").fadeIn(300);
    },function(){
        $(this).animate({top:"0px"}).find(".popup").fadeOut(300);
    });

});