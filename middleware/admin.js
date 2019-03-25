const jwt = require('jsonwebtoken')
const config = require('config')

function admin(req, res, next) {
    // 401 未授权
    // 403 禁止
    if(!req.user.isAdmin) return res.status(403).send('Access denied.')

    next()
}

module.exports = admin