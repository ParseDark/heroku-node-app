const {
    User,
    validate
} = require('../models/user');
const auth = require('../middleware/auth')
const _ = require('lodash')
const bcreypt = require('bcrypt')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.post('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
    
})

router.post('/', async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        email: req.body.email
    })
    if (user) {
        res.status(400).send('User already registered.')
    }

    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    const salt = await bcreypt.genSalt(10) // 这个可以理解为hash的复杂度
    user.password = await bcreypt.hash(user.password, salt)

    await user.save()

    _.pick(user, ['name', 'email'])

    const token = user.generateAuthToken()

    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']))
});

module.exports = router;