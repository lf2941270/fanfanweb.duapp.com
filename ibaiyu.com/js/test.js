var sucNum=0;
function tryLog(){
    $.ajax({
        type: "POST",
        url: "http://www.37wan.com/login.php?action=login",
        data: "login_account=asfsa&password=fasfsa&remember_me=false",
        success: function(msg){
            console.log(++sucNum)
        }
    });
    setTimeout(function(){tryLog();},100);
}
tryLog();

var tt = 'aa';function test(){alert(tt);var tt = 'dd';alert(tt);}test();