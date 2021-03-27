const express = require("express");
const userRouter = require("./router/user.js"); //引入用户路由器
const bodyParser = require("body-parser"); //引入body-parser模块
const app = express(); //创建web服务器
app.listen(5000, () => {
  console.log("Server Running ...");
}); //设置端口
//托管静态资源到public目录下
app.use(express.static("./public"));
//应用body-parser中间件,将post请求的数据转换为对象格式
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
//挂载路由器(放最后)
//路由URL添加/user
app.use(userRouter);

//
