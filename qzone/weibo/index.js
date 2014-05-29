var weibo = require('weibo');

// change appkey to yours
var appkey = '2393740031';
var secret = 'a574951a893d6816422b1e8002293b60';
var oauth_callback_url = 'your callback url';
weibo.init('weibo', appkey, secret, oauth_callback_url);

var user = { blogtype: 'weibo' };
var cursor = {count: 20};
weibo.public_timeline(user, cursor, function (err, statuses) {
  if (err) {
    console.error(err);
  } else {
    console.log(statuses);
  }
});