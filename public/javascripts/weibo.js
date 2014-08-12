
//配置参数
var stoptime = 200;//每个位置停留时间
var runtime = 200;//每次移动时间
var roundtime = 1000;//自动增长时，每轮的间隔时间

//全局变量
var n;//一共n个人
var k;//逐次杀掉第k个人

var autoround;//是否自动连续运行
var points;//记录位置和生存状况的数组，长度为n
var livingcount;//记录生存者数量
var cursor;//当前位置

var canvas; //画布
var ctx; //绘图内容
var offcanvas;//离屏画布
var offctx;//离屏绘图内容
var basesize;//基准尺寸（根据界面宽高较小一方计算）
var ballsize;//小球半径
var roundsize;//围起圈子的半径

var anime;//动画对象
var timespan;//用于计算每段的时间间隔
var animeangle;//动画显示角度
var stopping;//当前是否处于暂停在某个球上的状态，为false表示镜头正在移动中
var jumpnum;//本次增加的值（第一圈是k，以后每圈会根据数量有所增加）

//页面加载
$(function () {
	$("#btnStop").attr("disabled", "disabled");
	$("#inputn").val("50");
	$("#inputk").val("1");
	init();

	$("#btnStart").click(function () {
		n = parseInt($("#inputn").val());
		k = parseInt($("#inputk").val());
		if (isNaN(n) || n < 3 || n > 1000) {
			alert("请输入正确的数量！");
			return;
		}
		if (isNaN(k) || k < 1 || k > 999) {
			alert("请输入正确的间隔！");
			return;
		}
		if (k > n) {
			alert("间隔必须小于数量！");
			return;
		}

		k++;//实际k值比间隔值大1

		$("#btnStart").attr("disabled", "disabled");
		$("#inputn").attr("disabled", "disabled");
		$("#inputk").attr("disabled", "disabled");
		$("#chkauto").attr("disabled", "disabled");
		$("#btnStop").removeAttr("disabled");

		autoround = document.getElementById("chkauto").checked;
		$("#msgn").html("");
		$("#msgr").html("");
		startRound();
	});

	$("#btnStop").click(function () {
		$("#btnStart").removeAttr("disabled");
		$("#inputn").removeAttr("disabled");
		$("#inputk").removeAttr("disabled");
		$("#chkauto").removeAttr("disabled");
		$("#btnStop").attr("disabled", "disabled");
		if (anime) anime.stop();
	});
});

//初始化
function init() {
	canvas = document.getElementById("image");
	if (!canvas.getContext) self.location = "/nohtml5.html"
	else {
		//初始化容器尺寸
		var container = $("#container");
		container.height($(window).height() - $("#toolbar").height() - $("#msgbar").height() - 5);
		canvas.width = container.width();
		canvas.height = container.height();
		ctx = canvas.getContext("2d");
		basesize = Math.min(canvas.width, canvas.height);
		ballsize = basesize * 0.04;//指定球半径
	}
}

//根据当前的n和k，重启一轮运行
function startRound() {
	var angle = 360 / n;//计算每两个球夹的角度
	roundsize = Math.sqrt(4 * ballsize * ballsize / (1 - Math.cos(angle / 180 * Math.PI)));//余弦定理反推圈子半径

	//生成离屏画布
	offcanvas = document.createElement('canvas');
	offcanvas.width = roundsize * 2 + canvas.width;
	offcanvas.height = roundsize * 2 + canvas.height;
	offctx = offcanvas.getContext("2d");

	offctx.lineWidth = ballsize / 10;
	offctx.textAlign = "center";
	offctx.textBaseline = "middle";
	offctx.font = ballsize + "px Arial";

	offctx.clearRect(0, 0, offcanvas.width, offcanvas.height);
	offctx.strokeStyle = "#000";

	//生成小球中心点数组
	points = new Array();
	livingcount = n;
	for (var i = 0; i < n; i++) {
		points.push({
			x: Math.round(offcanvas.width * 0.5 + roundsize * Math.cos((i * angle - 90) / 180 * Math.PI)),
			y: Math.round(offcanvas.height * 0.5 + roundsize * Math.sin((i * angle - 90) / 180 * Math.PI)),
			living: true
		});
	}
	//绘制连线
	offctx.fillStyle = "#7BFF50";
	for (var i = 0; i < n; i++) {
		offctx.beginPath();
		offctx.moveTo(points[i].x, points[i].y);
		if (i != n - 1) {
			offctx.lineTo(points[i + 1].x, points[i + 1].y);
		}
		else {
			offctx.lineTo(points[0].x, points[0].y);
		}
		offctx.stroke();
	}
	//绘制小球
	for (var i = 0; i < n; i++) {
		drawSingleBall(i, "#7BFF50");
	}

	//执行动画
	cursor = k - 1;//定位到负数，以便第一个k位置的球能被处理
	animeangle = 360 * cursor / n;
	timespan = 0;
	stopping = true;
	jumpnum = k;
	//用于绘制FPS的文字
	ctx.textAlign = "end";
	ctx.textBaseline = "top";

	anime = createAnime(killing);
	anime.start();
}

//开始逐个杀死小球编号的人
function killing(framespan, fps) {
	if (stopping) {//暂停状态：累计时间等待继续
		timespan += framespan;
		if (timespan >= stoptime) {
			timespan = 0;
			stopping = false;
		}
	}
	else {//运行状态:移动镜头到下个球的路径上
		if (animeangle < 360 * cursor / n) {//移动过程中
			animeangle += framespan / runtime * k * 360 / n;//按时间间隔旋转角度，保持不同帧率下的速度
			if (animeangle > 360 * cursor / n) animeangle = 360 * cursor / n;//禁止超限
			drawPointer(animeangle)
			drawToScreen(animeangle);
		}
		else {//移动完成，镜头直接跳转到指定球
			stopping = true;//下一帧开始暂停
			if (livingcount > 1) {//如果不是最后一个
				points[cursor % n].living = false;//设置状态
				livingcount--;

				drawSingleBall(cursor, "#FF7B50");//将球绘为红色
				animeangle = 360 * cursor / n;
				drawPointer(animeangle)
				drawToScreen(animeangle);

				//计算下次的球号
				var k1 = 0, k2 = 0;//临时计数器。k1:预计增加数，k2:实际增加数
				while (k1 < k) {
					k2++;
					if (points[(cursor + k2) % n].living) k1++;
				}

				if (livingcount > 1)
					cursor += k2
				else
					cursor += k2 % n;//如果下个球就是最后一个的话，避免旋转过多，只留余数
			}
			else {//如果只剩最后一个球则停止
				animeangle = 360 * cursor / n;
				drawPointer(animeangle)
				drawToScreen(animeangle);
				anime.stop();

				points = null;
				$("#msgn").append("<td>&nbsp;&nbsp;" + n + "&nbsp;&nbsp;</td>");
				$("#msgr").append("<td>&nbsp;&nbsp;" + (cursor % n + 1) + "&nbsp;&nbsp;</td>");
				$("#msg").scrollLeft($("#msg table").width());

				if (n < 1000) {
					n++;//每轮执行完后都自动增加一次n值
					$("#inputn").val(n)

					if (autoround) {
						setTimeout(startRound, roundtime);
					}
					else {
						$("#btnStop").click();
					}
				}
				else {
					$("#btnStop").click();
				}
			}
		}
		ctx.fillStyle = "#660";
		ctx.fillText("FPS:" + fps, canvas.width, 0);
	}
}

//绘制单个小球
function drawSingleBall(i, color) {
	if (i < 0 || i >= n) i = (i + n) % n;//超范围

	offctx.fillStyle = color;
	offctx.beginPath();
	offctx.arc(points[i].x, points[i].y, ballsize, 0, Math.PI * 2, true);
	offctx.closePath();
	offctx.stroke();
	offctx.fill();
	offctx.fillStyle = "#000";
	offctx.fillText((i + 1).toString(), points[i].x, points[i].y);
}

//绘制指向某点的箭头
function drawPointer(angle) {
	var pointersize = roundsize - ballsize * 2;
	if (pointersize <= 0) pointersize = ballsize * 0.4;
	//清空中间圆形
	offctx.fillStyle = "#FFF";
	offctx.beginPath();
	offctx.arc(offcanvas.width * 0.5, offcanvas.height * 0.5, pointersize + 1, 0, Math.PI * 2, true);
	offctx.closePath();
	offctx.fill();

	//绘制箭头
	offctx.beginPath();
	offctx.moveTo(offcanvas.width * 0.5, offcanvas.height * 0.5);
	var x = Math.floor(offcanvas.width * 0.5 + pointersize * Math.cos((angle - 90) / 180 * Math.PI));
	var y = Math.floor(offcanvas.height * 0.5 + pointersize * Math.sin((angle - 90) / 180 * Math.PI));
	offctx.lineTo(x, y);
	offctx.stroke();
}

//将后台画布内容转印到前台
function drawToScreen(angle) {
	ctx.clearRect(0, 0, offcanvas.width, offcanvas.height);
	//如果球数过少，圆环尺寸小于画面尺寸则不动
	var x, y;
	if ((roundsize + ballsize) * 2 <= basesize) {
		x = offcanvas.width * 0.5;
		y = offcanvas.height * 0.5;
	}
	else {
		//画面中心在圆环靠里一些的位置
		x = offcanvas.width * 0.5 + (roundsize - basesize * 0.2) * Math.cos((angle - 90) / 180 * Math.PI);
		y = offcanvas.height * 0.5 + (roundsize - basesize * 0.2) * Math.sin((angle - 90) / 180 * Math.PI);
	}

	ctx.drawImage(offcanvas, Math.round(canvas.width * 0.5 - x), Math.round(canvas.height * 0.5 - y));
}


