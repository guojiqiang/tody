
// 统一处理api下方的所有接口的公共参数,如果没有,设置默认值


let jwt = require('../../utils/jwt')

module.exports = (req, res, next) => {

  //处理公共参数  address | !address | headers
  
  req.query._page = req.query._page ? req.query._page - 1 : require('../../config/global')._page - 0;
  // 传了页数,就显示对应页数,我们是第0页开始,-1.就是怕客户传第1页.而我们-1正好拿到第0页,后面require里面-0是怕config里面的默认页数设置成字符串的"0",而-0.可以转换成数字,
  req.query._limit = req.query._limit ? req.query._limit - 0 : require('../../config/global')._limit - 0;
  req.query.q = req.query.q ? req.query.q : require('../../config/global').q;
  req.query._sort = req.query._sort ? req.query._sort : require('../../config/global')._sort;

  req.body._page = req.body._page ? req.body._page - 1 : require('../../config/global')._page - 0;
  req.body._limit = req.body._limit ? req.body._limit - 0 : require('../../config/global')._limit - 0;
  req.body.q = req.body.q ? req.body.q : require('../../config/global').q;
  req.body._sort = req.body._sort ? req.body._sort : require('../../config/global')._sort;

  req.headers._page = req.headers._page ? req.headers._page - 1 : require('../../config/global')._page - 0;
  req.headers._limit = req.headers._limit ? req.headers._limit - 0 : require('../../config/global')._limit - 0;
  req.headers.q = req.headers.q ? req.headers.q : require('../../config/global').q;
  req.headers._sort = req.headers._sort ? req.headers._sort : require('../../config/global')._sort;


  //处理公共授权业务

  if (/login|reg|logout/.test(req.url)) {//登录、注册、注销、无需token
    next()
  } else {//自动登录，商品列表、详情需要token
    //token校验
    //1. 获取token
    let token = req.headers.token || req.body.token || req.query.token;

    //2.校验token
    jwt.verify(token).then(
      decode => {
        req.query.decode = decode;
        next()
      }
    ).catch(
      message => res.send({
        err: 2,
        msg: 'token过期或者未登录' + message
      })
    )

  }

}