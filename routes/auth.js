const {
    User
} = require('../models/user');
const _ = require('lodash')
const bcreypt = require('bcrypt')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
// const Joi = require('joi')

// 这里的登录比较简单， 就是用户传入账号和密码， 服务端验证账号和密码， 然后返回true or fales
router.post('/', async (req, res) => {
    const {
        error
    } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        email: req.body.email
    })
    if (!user) {
        res.status(400).send('Invalid email or password.')
    }

    const validPassword = await bcreypt.compare(req.body.password, user.password)

    if (!validPassword) {
        res.status(400).send('Invalid email or password.')
    }

    // 什么是JWT, json web token. 一种标识用户的字符串
    // 用户发送登录请求， 服务器接收请求并验证登录信息（通常是密钥）， 服务器计算token， 返回给用户， 在接下来的请求中，
    // 用户使用这个token，在使用一些私人的API请求的时候，会要求使用token验证，此时在请求头要包含token验证字符
    // JWT组成
    // 1. head
    //     1. 使用算法
    //     2. 类型 
    // 2. palyload
    //      1. sub
    //      2. name
    //      3. admin
    // 3. verify signature
    // 数字签名基于以上的head 以及 palyload， 计算出的一个类似hash5的密钥，跟随head和palyload改变
    // 生成这个数字签名需要服务端的私钥， 所以就算拿到了token， 只要修改了head, 和palyload, 也会在服务端验证数字签名这一环被识别
    
    // create token
    // 注意， 你的私钥不应该放在代码中，应该分离开，放在环境变量中， 可配置
    const token = user.generateAuthToken()
    res.send(token)
});


// 这里可以使用Joi-password-complexity的npm 库，对密码进行定制校验
function validateUser(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;