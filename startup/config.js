const config = require('config')
module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('Fatal error: jwtPrivateKey is not defined.')
        // process.exit(1) // process Node的全局变量， exit方法， 一个传参， 0表示成功， 0之外表示失败
        // 设置全局变量的方法： export vidly_jwtPrivateKey=mySecureKey
    }
}