const express = require('express');
const logger = require('./middleware/logger')
require('express-async-errors')


// 实例化express
const app = express();

// 日志处理
require('./startup/logging')()
// 挂载中间件
require('./startup/routes')(app)
// 链接数据库
require('./startup/db')()
// 检测是否配全局变量(token密钥)
require('./startup/config')()
// 引入JOI校验工具
require('./startup/validation')()
// 开启生产环境配置： http保护 + 代码压缩
require('./startup/prod')(app)

// throw new Error('Something is error.')

// const p = Promise.reject(new Error('run fail'))
// p.then(() => console.log('some error'))


const port = process.env.PORT || 4000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server