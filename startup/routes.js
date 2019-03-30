const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const user = require('../routes/user')
const auth = require('../routes/auth')
const error = require('../middleware/error')
const express = require('express');


module.exports = function (app) {
    // 应用启动阶段， 挂载中间件
    app.use(express.json());
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', user);
    app.use('/api/auth', auth);

    // 应用级别日志
    app.use(error)


}