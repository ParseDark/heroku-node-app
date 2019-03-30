const logger = require('../middleware/logger')

module.exports = function () {
    // 在启动应用捕获错误， 非异步
    process.on('uncaughtException', (ex) => {
        console.log('uncaught')
        logger.error(ex.message, ex);
        process.exit(1)
    })

    // 在启动应用存在异步函数捕获
    // 系统级别错误日志(异步)
    // 这里当时出了个小问题， 就是不知道为啥，这里总打印不出日志， 因为logger本身
    // 也是异步函数， 在异步函数没完成的时候， 就已经退出了进程，也就是process.exit(1) 这个logger就没打完成
    process.on('unhandledRejection', (ex) => {
        console.log('rejection')
        logger.error(ex.message, ex);
        process.exit(1)
    })
}