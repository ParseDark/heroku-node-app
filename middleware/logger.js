const {
    createLogger,
    transports,
} = require('winston');
require('winston-mongodb')

const logger = createLogger({
    transports: [
        // 系统级别
        new transports.File({
            filename: './vidly_info.log', level: 'info'
        }),
        // // 数据库级别日志
        // new transports.MongoDB({
        //     db: 'mongodb://localhost:27017/testDB',
        //     filename: './mongodbLog',
        //     level: 'warn'
        // }),
        // // 终端命令行输出
        new transports.Console()
    ]
});

module.exports = logger