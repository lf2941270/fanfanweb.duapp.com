$(document).ready(function(){
    $.fn.showInputError=function(msg){
        $(this).nextAll(".info-box").find(".error").text(msg).show();
        return this;
    }
    $.fn.removeInputError=function(){
        $(this).nextAll(".info-box").find(".error").text("").hide();
        return this;
    }
    $.fn.showInputCorrect=function(){
        $(this).nextAll(".info-box").find(".correct").show();
        return this;
    }
    $.fn.removeInputCorrect=function(){
        $(this).nextAll(".info-box").find(".correct").hide();
        return this;
    }
    function CheckForm(){
        //错误信息数组
        var errMsg=[],
            _=this,
            corrNum=0;
        errMsg[0]={
            1:"账号不能为空",
            2:"账号格式不正确",
            3:"该账号已经被注册了，请更换账号后重新注册"
        };
        errMsg[1]={
            1:"密码不能为空",
            2:"密码格式不正确"
        }
        errMsg[2]={
            1:"请再次输入密码",
            2:"两次输入的密码不一致，请确认后重新输入"
        }
        errMsg[3]={
            1:"邮箱不能为空",
            2:"请填写正确的邮箱地址"
        }
        errMsg[4]={
            1:"姓名不能为空",
            2:"姓名格式不正确"
        }
        errMsg[5]={
            1:"身份证号码不能为空",
            2:"身份证号码格式不正确"
        }
        errMsg[6]={
            1:"请填写验证码",
            2:"验证码输入有误，请重新输入"
        }
        //检查账号输入
        this.checkAccount=function(){
            var val=$(this).val();
            if(val===""||val==="请输入账号"){
                $(this).showInputError(errMsg[0][1]);
            }else if(!(/^[a-zA-Z]\w{5,15}$/gi).test(val)){
                $(this).showInputError(errMsg[0][2]);
            }else{
                //ajax验证账号是否已注册，若是已注册，显示错误消息
                //服务器域名不同，无法跨域验证
                /*$.ajaxSetup({ cache: false });
                $.ajax({
                    type: "GET",
                    url: "http://www.ibaiyu.cn/tools/validatename.ashx",
                    dataType: "html",
                    crossDomain:"true",
                    data: "action=gameuser_validate&name=" + val,
                    beforeSend: function (XMLHttpRequest) {
                    },
                    success: function (msg) {
                        if (msg != "true") {
                            $(this).showInputError(errMsg[0][3]);
                            return false;
                        }else{
                            //否则显示输入正确图标
                            $(this).showInputCorrect();
                        }
                    }
                });*/
                //否则显示输入正确图标
                $(this).showInputCorrect();
                corrNum++;
            }
        }
        this.checkPassword=function(){
            var val=$(this).val();
            if(val===""){
                $(this).showInputError(errMsg[1][1]);
            }else if(!(/\w{6,16}/gi).test(val)){
                $(this).showInputError(errMsg[1][2]);
            }else{
                $(this).showInputCorrect();
                corrNum++;
            }
        }
        this.confirmPassword=function(){
            var val=$(this).val();
            if(val===""){
                $(this).showInputError(errMsg[2][1]);
            }else if(val!==$("#password").val()){
                $(this).showInputError(errMsg[2][2]);
            }else{
                $(this).showInputCorrect();
                corrNum++;
            }
        }
        this.checkEmail=function(){
            var val=$(this).val();
            if(val===""){
                $(this).showInputError(errMsg[3][1]);
            }else if(!(/[a-z0-9-]{1,30}@[a-z0-9-]{1,65}.[a-z]{2,}/gi).test(val)){
                $(this).showInputError(errMsg[3][2]);
            }else{
                $(this).showInputCorrect();
                corrNum++;
            }
        }
        this.checkName=function(){
            var val=$(this).val();
            if(val===""){
                $(this).showInputError(errMsg[4][1]);
            }else if(!(/^[\u4e00-\u9fa5]{2,}$/gi).test(val)){
                $(this).showInputError(errMsg[4][2]);
            }else{
                $(this).showInputCorrect();
                corrNum++;
            }
        }
        this.checkIdcard=function(){
            var val=$(this).val();
            if(val===""){
                $(this).showInputError(errMsg[5][1]);
            }else if(!(/(^\d{15}$)|(^\d{17}(\d|X)$)/).test(val)){
                $(this).showInputError(errMsg[5][2]);
            }else{
                $(this).showInputCorrect();
                corrNum++;
            }
        }
        this.checkIdenti=function(){
            var val=$(this).val();
            if(val===""){
                $(this).showInputError(errMsg[6][1]);
            }else if(!(/^[a-z0-9]{4}$/gi).test(val)){
                $(this).showInputError(errMsg[6][2]);
            }else{
                //先ajax检测验证码是否正确

                //显示输入正确图标
                $(this).showInputCorrect();
                corrNum++;
            }
        }
        this.checkAll=function(){
            corrNum=0;
            _.checkAccount.apply($(this).find("#username").removeInputCorrect().removeInputError());
            _.checkPassword.apply($(this).find("#password").removeInputCorrect().removeInputError());
            _.confirmPassword.apply($(this).find("#confirm").removeInputCorrect().removeInputError());
            _.checkEmail.apply($(this).find("#email").removeInputCorrect().removeInputError());
            _.checkName.apply($(this).find("#realname").removeInputCorrect().removeInputError());
            _.checkIdcard.apply($(this).find("#idcard").removeInputCorrect().removeInputError());
            _.checkIdenti.apply($(this).find("#identi").removeInputCorrect().removeInputError());
            if(corrNum===7){
                if($(this).find("#agree").attr("checked")==="checked"){
                    //全部表单填写正确，可以提交了
                    $(this).submit();
                }else{
                    $.showErr("您必须阅读并接受《爱百娱用户服务条款》");
                }
            }else{
                $.showErr("有一些表单没有填写或者填写有误哦");
            }
        }
    }
    var checkForm=new CheckForm();

    //检测密码强度的对象
    var checkPwdLevel = {
        //CharMode函数
        //测试某个字符是属于哪一类.
        charMode : function (str){
            if (str>=48 && str <=57) //数字
                return 1;
            if (str>=65 && str <=90) //大写字母
                return 2;
            if (str>=97 && str <=122) //小写
                return 4;
            else
                return 8; //特殊字符
        },
        //bitTotal函数
        //计算出当前密码当中一共有多少种模式
        bitTotal : function (num){
            var modes=0;
            for (i=0;i<4;i++){
                if (num & 1) modes++;
                num>>>=1;
            }
            return modes;
        },
        //checkStrong函数
        //返回密码的强度级别
        getLevel: function (pwd){
            if (pwd.length<6)
                return 0; //密码太短
            var temp = 0;
            for (i=0;i<pwd.length;i++){
            //测试每一个字符的类别并统计一共有多少种模式.
                temp|= checkPwdLevel.charMode(pwd.charCodeAt(i));
            }
            return checkPwdLevel.bitTotal(temp);
        },
        getPwdLevel : function() {
            var pwd=$(this).val();
            if(pwd==null) return;
            var lev = checkPwdLevel.getLevel(pwd),
                i=$(this).next(".intensity").find("i");
            if(lev == 0) {
                //都为默认值
                i.attr('class','');
            }else if(lev == 1) {
                //低级别
                i.attr('class','low');
            }else if(lev == 2 || (lev == 3&&pwd.length<12)) {
                //中级别
                i.attr('class','medium');
            }else {
                //高级别
                i.attr('class','high');
            }
        }
    }
    //密码输入框变动时检查密码强度
    $("#password").keyup(function(){
        checkPwdLevel.getPwdLevel.apply($(this));
    });
    //点击更换验证码图片
    $(".identi-img").click(function(){
        $(this).attr("src","http://www.ibaiyu.cn/tools/verify_code.ashx?r="+(Math.random().toString().substr(10))).prev().trigger("focus");
        return false;
    });
    $(".reg-form").find(".input").focus(function(){
        //隐藏错误消息和正确消息
        //显示提示信息
        $(this).removeInputError().removeInputCorrect().siblings(".info-box").find(".notice").fadeIn(300);

    }).blur(function(){
            //收起提示信息
            $(this).siblings(".info-box").find(".notice").hide();
            //根据输入框的id值调用相应的检测函数
            switch ($(this).attr("id")){
                case "username":
                    checkForm.checkAccount.apply(this);
                    break;
                case "password":
                    checkForm.checkPassword.apply(this);
                    break;
                case "confirm":
                    checkForm.confirmPassword.apply(this);
                    break;
                case "email":
                    checkForm.checkEmail.apply(this);
                    break;
                case "realname":
                    checkForm.checkName.apply(this);
                    break;
                case "idcard":
                    checkForm.checkIdcard.apply(this);
                    break;
                case "identi":
                    checkForm.checkIdenti.apply(this);
                    break;
            }
        }).eq(0).trigger("focus");
    //按下注册按钮时，检查整个表单各个输入框的输入是否合法
    $(".btn-reg").click(function(){
        checkForm.checkAll.apply($(this).parent());
    });
    $(".btn-login").click(function(){
        $(this).parent().submit();
    })


});