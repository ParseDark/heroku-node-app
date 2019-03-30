const mongoose = require('mongoose');
const logger = require('../middleware/logger')
const config = require('config')

module.exports = function () {
    mongoose.connect(config.get('db'))
        .then(() => {
            logger.info(`connected mongodb${config.get('db')}.....`)
        })
        .catch(err => {
            logger.error('connected fail')
        });


}