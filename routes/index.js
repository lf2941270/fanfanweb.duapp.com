var crypto = require('crypto');//生成散列值用的
var User = require('../models/user');
var Post = require('../models/post');
var util=require('util');
var httpRequest = require('https');
//var BufferHelper = require('bufferhelper');
var Buffer=require('buffer');
var ipWhiteList=['192.168.1.104','127.0.0.1','192.168.1.109'];

module.exports = function(app) {
//    app.get('/test',function(req,res){
//        res.end(util.inspect(process.env));
//    })
    app.get('*',beforeAll)
    app.get('/', function(req, res) {
        Post.get(null, function(err, posts) {
            if (err) {
                posts = [];
            }
            res.render('index', {
                title: '首页',
                posts: posts
            });
        });
    });
    app.get('/reg', checkNotLogin);
    app.get('/reg', function(req, res) {
        res.render('reg', {
            title: '用户注册'
        });
    });
    app.post('/reg', checkNotLogin);
    app.post('/reg', function(req, res) {
//检验用户两次输入的口令是否一致
        if (req.body['password-repeat'] != req.body['password']) {
            req.session.error= '两次输入的口令不一致';
            return res.redirect('/reg');
        }//生成口令的散列值
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');
        var newUser = new User({
            name: req.body.username,
            password: password
        });

        //检查用户名是否已经存在.
        User.get(newUser.name, function(err, user) {
            if (user)
                err = 'Username already exists.';
            if (err) {
                req.session.error=err.toString();
                console.log(util.inspect(err))
                return res.redirect('/reg');
            }
            //如果不存在则新增用户
            newUser.save(function(err) {
                if (err) {
                    req.session.error=err.toString();
                    console.log(util.inspect(err))
                    return res.redirect('/reg');
                }
                req.session.user = newUser;
                req.session.success= '注册成功';
                res.redirect('/');
            });
        });
    });
    app.get('/login', checkNotLogin);
    app.get('/login', function(req, res) {
        res.render('login', {
            title: '用户登陆'
        });
    });
    app.post('/login', checkNotLogin);
    app.post('/login', function(req, res) {
//生成口令的散列值
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');
        User.get(req.body.username, function(err, user) {
            if (!user) {
                req.session.error= '用户不存在';
                return res.redirect('/login');
            }
            if (user.password != password) {
                req.session.error= '用户口令错误';
                return res.redirect('/login');
            }
            req.session.user = user;
            req.session.success= '登陆成功';
            res.redirect('/');
        });
    });
    app.get('/logout', checkLogin);
    app.get('/logout', function(req, res) {
        req.session.user = null;
        req.session.success='退出登录成功';
        res.redirect('/');
    });
    app.post('/post', checkLogin);
    app.post('/post', function(req, res) {
        var currentUser = req.session.user;
        var post = new Post(currentUser.name, req.body.post);
        post.save(function(err) {
            if (err) {
                req.session.error= err;
                return res.redirect('/');
            }
            req.session.success= '发表成功';
            res.redirect('/u/' + currentUser.name);
        });
    });

    app.get('/u/:user', function(req, res) {
        User.get(req.params.user, function(err, user) {
            if (!user) {
                req.session.error='用户不存在';
                return res.redirect('/');
            }
            req.session.success='用户存在';
            Post.get(user.name, function(err, posts) {
                if (err) {
                    req.session.error= err;
                    return res.redirect('/');
                }
                res.render('user', {
                    title: user.name+"的个人主页",
                    posts: posts
                });
            });
        });
    });
//  测试页
    app.get('/test',function(req,res){
      res.send("The time is "+new Date().toString());
    });
    app.get(/^\/commits\/(\w+)(?:\.\.(\w+))?$/,function(req,res){
      var from = req.params[0];
      var to = req.params[1] || 'HEAD';
      res.send('commit range from ' + from + ' to ' + to);
    });
//  百度OAuth认证
    app.get('/oauth/baidu',function(req,res){
      res.redirect("https://openapi.baidu.com/oauth/2.0/authorize?"+
        "response_type=code&" +
        "client_id=YdQqkHD83AqKIxPxRoOVd0wN&" +
        "redirect_uri=http://fanfanweb.duapp.com/oauth/baidu/login_success&" +
//        "scope=email&" +
        "display=popup");
    });
//  通过Authorization Code获取Access Token
  app.get('/oauth/baidu/login_success',function(req,res){
//    console.log(util.inspect(req.query))
    var code=req.query.code;
    var url="https://openapi.baidu.com/oauth/2.0/token?" +
        "grant_type=authorization_code&" +
        "code=" +code+"&"+
        "client_id=YdQqkHD83AqKIxPxRoOVd0wN&"+
        "client_secret=dyp6Ur2X7L5LFpyxGEc4IkOUeLGEbNeF&" +
        "redirect_uri=http://fanfanweb.duapp.com/oauth/baidu/login_success";
//    console.log(url)
    var options=require('url').parse(url);
    options.method='POST';

    var httpsReq=httpRequest.request(options, function(response) {

      response.on('data', function (d) {
//        res.end(JSON.parse(d.toString()).access_token)
				var url2="https://openapi.baidu.com/rest/2.0/passport/users/getLoggedInUser?access_token="+JSON.parse(d.toString()).access_token;
			  var	options2=require('url').parse(url2);
				var httpsReq2=httpRequest.request(options2,function(response2){
					response2.on('data',function(d){
						console.log(d.toString());
						res.write(d.toString());
					});
					response2.on('end',function(){
						res.end();
					})
				});
				httpsReq2.end();
        /*var data=new Buffer(d,'utf8');
        res.end(data);*/
//        process.stdout.write(d);
//        res.end(util.inspect(d))
      });
//      response.on('end',function(d){
//        res.write('code:'+code+'\n'+'认证成功')
//        res.end('看起来像是登陆成功的样纸。。。')//
//      })
      });
    httpsReq.end();
    });
    //对其余的情况返回404错误
    app.get('*',function(req,res){
      res.writeHead(404);
      res.end('404 Page Not Found!');
    })
};

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.session.error='未登陆';
        return res.redirect('/login');
    }
    next();
}
function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.session.error='已登陆';
        return res.redirect('/');
    }
    next();
}
function beforeAll(req,res,next){
  console.log(new Date() + ' IP: '+req._remoteAddress+ ' Request url: ' +req.url);
  if(ipWhiteList.indexOf(req._remoteAddress)===-1){
      res.send('<script type="text/javascript">alert("你好，来自'+req._remoteAddress+'的逗比！你暂时没有访问权限哦！")</script>');
  }else{
    next();
  }
}
