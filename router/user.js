const express = require("express"); //引入express模块
const pool = require("../pool.js"); //引入连接池
const querystring = require("querystring");
const fs = require("fs");
const { join } = require("path");
//创建路由器对象
const r = express.Router();

// 获取轮播图图片
r.get("/car", (request, response) => {
  let sql = "select * from carousel";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    response.send(result);
  });
});

// 用户登录
r.get("/login", (request, response) => {
  let obj = request.query;
  let user = obj.uname;
  let pwd = obj.upwd;
  // console.log(obj);
  let sql = "select * from user where uname=? and upwd=?";
  pool.query(sql, [user, pwd], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      response.send({ msg: "ok", result: result[0] });
    } else {
      response.send("err");
    }
  });
});

// 用户注册
r.get("/register", (req, res) => {
  let uname = req.query.uname;
  let upwd = req.query.upwd;
  let sql = "insert into user (uname,upwd) values (?,?)";
  pool.query(sql, [uname, upwd], (err, result) => {
    console.log(result);
    if (result != undefined) {
      res.send("1");
    } else {
      res.send("0");
    }
  });
});

// 请求商品
r.get("/product", (req, res) => {
  let sql = "select * from product";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 查询详情页
r.get("/details", (req, res) => {
  let id = req.query.pid;
  // 查询图片
  let sql = "select * from product_img where product_id = ?";
  // 查询信息
  let sql2 = "select * from product where product_id = ?";
  let arr = [];
  // 获取单个商品的轮播图图片
  pool.query(sql, [id], (err, result) => {
    if (err) throw err;
    arr.push(result);
    // 查询单个商品的详情
    pool.query(sql2, [id], (err, data) => {
      if (err) throw err;
      arr.push(data[0]);
      res.send(arr);
    });
  });
});

// 加入购物车
r.get("/addcart", (req, res) => {
  let uid = req.query.uid;
  let pid = req.query.pid;
  let sql = "INSERT INTO usercart (uid, pid) VALUES (?,?)";
  pool.query(sql, [uid, pid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send("1");
    } else {
      res.send("0");
    }
  });
});

// 查询购物车
r.get("/setcart", (req, res) => {
  let uid = req.query.uid;
  /**
   * 这是一个很难很难很难的数据查询!!!emmm...好吧,,,是对我而言
   */
  let sql =
    "SELECT product_id,product_name,product_picture,product_price,pcount,usercart.cid from product,usercart WHERE product_id = usercart.pid and usercart.uid = ?";
  pool.query(sql, uid, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//删除商品
r.get("/del", (req, res) => {
  let cid = req.query.cid;
  let sql = "DELETE FROM `usercart` WHERE cid = ?";
  console.log(req.query);
  pool.query(sql, [cid], (err, result) => {
    if (err) throw err;
    console.log(result);
    if (result.affectedRows > 0) {
      res.send("1");
    } else {
      res.send("0");
    }
  });
});

// 修改购物车
r.get("/upd", (req, res) => {
  let cid = req.query.cid;
  let count = req.query.count;
  let sql = "UPDATE usercart SET pcount= ? WHERE cid = ?";
  pool.query(sql, [count, cid], (err, result) => {
    if (err) throw err;
    res.send("1");
  });
});

// 分类查询商品
r.get("/getclass", (req, res) => {
  let id = req.query.id;
  let sql = "select * from product where category_id = ?";
  pool.query(sql, id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 加入收藏夹
r.get("/addfavorite", (req, res) => {
  let uid = req.query.uid;
  let pid = req.query.pid;
  console.log(uid, pid);
  let sql = "insert into favorite (uid,pid) values (?,?)";
  pool.query(sql, [uid, pid], (err, result) => {
    if (result !== undefined) {
      res.send("1");
    } else {
      res.send("0");
    }
  });
});

// 查询收藏夹
r.get("/getfavorite", (req, res) => {
  let uid = req.query.uid;
  let sql =
    "SELECT product_id,product_name,product_picture,product_price,product_title,favorite.fid from product,favorite WHERE product_id = favorite.pid and favorite.uid = ?";
  pool.query(sql, uid, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 删除收藏夹商品
r.get("/delfavorite", (req, res) => {
  let fid = req.query.fid;
  let sql = "delete from favorite where fid = ?";
  pool.query(sql, fid, (err, result) => {
    if (result.affectedRows > 0) {
      res.send("1");
    } else {
      res.send("0");
    }
  });
});

//导出路由器
module.exports = r;

//
