const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey'))

    return token
}

const User = mongoose.model('User', userSchema);

// 这里可以使用Joi-password-complexity的npm 库，对密码进行定制校验
function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(user, schema);
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;