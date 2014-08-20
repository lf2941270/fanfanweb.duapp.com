function getNews() {
    $.ajax({
        type: "post",
        url: "./Servers/HazgDlq.ashx?method=GetNews",
        success: function (text) {
            CreateNews(text);
        }
    })
}

function CreateNews(a) {
    var jsonObj = eval(a);
    for (var i = 0; i < jsonObj.length; i++) {
        //        $(".news-c ul").append("<li><a href=\"../../news.aspx?id=" + jsonObj[i].Id + "\" style=\"color:" + jsonObj[i].Namecolor + "\" target=\"_blank\" title=\"" + jsonObj[i].Title + "\"> <span>【" + jsonObj[i].Release_time.substring(2, jsonObj[i].Release_time.length - 8) + "】</span>" + jsonObj[i].Title + "</a></li>");
        $("#News").append("<li><a href=\"../../news.aspx?id=" + jsonObj[i]._id + "\"  target=\"_blank\" title=\"" + jsonObj[i]._title + "\"><i class=\"btns ico_icon\"></i>" + jsonObj[i]._title + "</a></li>")
    }
}

function getNews2() {
    $.ajax({
        type: "post",
        url: "./Servers/HazgDlq.ashx?method=GetNews2",
        success: function (text) {
            CreateNews2(text);
        }
    })
}

function CreateNews2(a) {
    var jsonObj = eval(a);
    for (var i = 0; i < jsonObj.length; i++) {
        //        $(".news-c ul").append("<li><a href=\"../../news.aspx?id=" + jsonObj[i].Id + "\" style=\"color:" + jsonObj[i].Namecolor + "\" target=\"_blank\" title=\"" + jsonObj[i].Title + "\"> <span>【" + jsonObj[i].Release_time.substring(2, jsonObj[i].Release_time.length - 8) + "】</span>" + jsonObj[i].Title + "</a></li>");
        $("#con_one_2").append("<li><a href=\"../../news.aspx?id=" + jsonObj[i]._id + "\"  target=\"_blank\" title=\"" + jsonObj[i]._title + "\">" + jsonObj[i]._title + "</a></li>")
    }
    $("#con_one_2").append("<li class=\"more\"><a href=\"../../news_list.aspx\" target=\"_blank\" title=\"查看更多\">查看更多</a></li>");
}

function GetUser() {
    $.ajax({
        type: "post",
        url: "./Servers/HazgDlq.ashx?method=GetSession",
        success: function (text) {
            if (text == "") {
                location.href = "../index.html";
            } else {
                $("#ustr").html(text);
            }
        }
    })
}

function GetLastLogin() {
    $.ajax({
        type: "post",
        url: "./Servers/HazgDlq.ashx?method=GetLastLogin",
        success: function (text) {
            var re = text.split("|");
            if (re[0] == "无") {
                $("#GetLastLogin").attr("style", "display:none");
            }
            else {
                if (re[2] == "1" || re[2] == "2") {
                    $("#LastLogin").html("" + re[0] + "<i class=\"btns ico_gray\"></i>");
                    $("#LoginGame").removeAttr("href");
                } else {
                    $("#LastLogin").html("" + re[0] + "<i class=\"btns ico_green\"></i>");
                    $("#LoginGame").attr("href", re[1]);
                }
            }
        }
    })
}

function GetTj() {
    $.ajax({
        type: "post",
        url: "./Servers/HazgDlq.ashx?method=GetTjServer",
        success: function (text) {
            var re = text.split("|");
            if (re[2] == "1" || re[2] == "2") {
                $("#TjName").html("" + re[0] + "<i class=\"btns ico_gray\"></i>");
                $("#TjUrl").removeAttr("href");
            } else {
                $("#TjName").html("" + re[0] + "<i class=\"btns ico_green\"></i>");
                $("#TjUrl").attr("outServerId", re[3]);
                $("#TjUrl").click(function () { getId(this) });
                $("#TjUrl").attr("href", re[1]);
            }
        }
    })
}

function GetServer() {
    $.ajax({
        type: "post",
        url: "./Servers/HazgDlq.ashx?method=GetServers",
        success: function (text) {
            var jsonObj = eval(text);
						var serversHTML="";

						for (var i = 0; i < jsonObj.length; i++) {
							if(jsonObj[i]._state==1||jsonObj[i]._state==2){
								serversHTML="<li><a id=\"LogonServers\" onclick=\"return false;\" title=\"" + jsonObj[i]._name + "\" target=\"_blank\" class=\"s1\">" + jsonObj[i]._name + "</a><span class=\"btns ico_gray\"></span></li>";
							}else{
								serversHTML="<li><a outServerId=\"" + jsonObj[i]._id + "\" onclick=\"getId(this)\" title=\"" + jsonObj[i]._name + "\">" + jsonObj[i]._name + " </a><span class=\"btns ico_green\"></span></li>";
							}
							$("#AllServer").append(serversHTML);
							LogonServers(jsonObj[i]._id, jsonObj[i]._state, jsonObj[i]._name);
						}
						$('.scroll-pane').jScrollPane();
        }
    })
}

function LogonServers(server, state, servername) {
    $.ajax({
        type: "post",
        url: "./Servers/HazgDlq.ashx?method=LoginServers&number=" + server,
        success: function (text) {
            $("a[outServerId='"+server+"']").attr("href",text);
        }
    })
}

function show() {
    $("#Tjqufu").attr("style", "display:none");
    $("#qufu").removeAttr("style");
}
function showTjqufu() {
    //    $("#Tjqufu").removeAttr("style");
    $("#Tjqufu").attr("style", "display:block");
    $("#qufu").attr("style", "display:none");
}

function getId(dom) {
    /* 火狐浏览器控制台输出*/
    //    console.log(dom);
    /* 火狐浏览器控制台输出*/
    $.ajax({
        type: "post",
        url: "./Servers/HazgDlq.ashx?method=Login_onlinelog&serverid=" + dom.getAttribute('outServerId')
    })
}

/* 首页密码错误提示*/
function getParmFromHref(parm) {
    search = window.location.search.substr(1).split("&");
    value = "";
    $.each(search, function () {
        if (this.indexOf(parm + "=") === 0) {
            value = this.substr(this.indexOf("=") + 1);
            return value;
        }
    })
    return value;
}

$(document).ready(function () {
    if (getParmFromHref('error') == 1) {
        //        alert("用户名或密码错误");
        showErrMsg("用户名或密码错误");
    }
})
/* 首页密码错误提示*/
