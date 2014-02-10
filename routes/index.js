var crypto = require('crypto');//生成散列值用的
var User = require('../models/user');
var Post = require('../models/post');
var util=require('util');
module.exports = function(app) {
    app.get('/', function(req, res) {
        Post.get(null, function(err, posts) {
            if (err) {
                posts = [];
            }
            res.render('index', {
                title: '首页',
                posts: posts,
                test : process.env.SERVER_SORTWARE
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