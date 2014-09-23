var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport("SMTP", {
  host: "smtp.163.com",
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  auth: {
    user: "lf2941270@163.com",
    pass: "lifan19890826"
  }
});
function sendMail(to,subject,html,generateTextFromHTML,callback){
  transport.sendMail({
    from:"lf2941270@163.com",
    to:to,
    subject:subject,
    generateTextFromHTML:generateTextFromHTML,
    html:html
  },function(err,response){
    callback(err,response);
    transport.close();
  });
}
module.exports=sendMail;
/*
transport.sendMail({
  from : "lf2941270@163.com",
  to : "454730788@qq.com",
  subject: "再次测试",
  generateTextFromHTML : true,
  html : "<strong>啊哈哈哈</strong>"
}, function(error, response){
  if(error){
    console.log(error);
  }else{
    console.log("Message sent: " + response.message);
  }
  transport.close();
});*/
