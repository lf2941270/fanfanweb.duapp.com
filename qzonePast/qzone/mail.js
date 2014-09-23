var BaeMessage=require('./baemessage');
var bae = new BaeMessage({
  key : 'YdQqkHD83AqKIxPxRoOVd0wN', //API KEY
  secret : 'dyp6Ur2X7L5LFpyxGEc4IkOUeLGEbNeF' //API 密钥
});
//通过mail函数发送邮件, 参数分别为 发件人地址, 收件人地址, 主题, 内容
/*
bae.mail('fromAddress', 'to', 'title', 'mail body');*/
module.exports=bae;