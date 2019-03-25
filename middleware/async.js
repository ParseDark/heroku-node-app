// 工厂函数封装错误处理
module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            await handler()
        } catch (ex) {
            next(ex)
        }
    }
}