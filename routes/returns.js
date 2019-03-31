const express = require('express');
const Joi = require('joi');
const router = express.Router();
const auth = require('../middleware/auth')

const {
    Rental
} = require('../models/rental')
const {
    Movie
} = require('../models/movie')

router.post('/', auth, async (req, res) => {
    // const {
    //     error
    // } = validateReturn(req.body)
    // if (error) res.status(400).send(error)
    if (!req.body.customerId) res.status(400).send('customId unprovided.')
    if (!req.body.movieId) res.status(400).send('movieId unprovided.')

    // static Method: 工具方法，不需要实例化
    // instance Method: 实例方法，需要一个实例来调用

    // 这里没成功，不知道为啥
    // const rental1 = await Rental.lookup(req.body.customId, req.body.movieId)

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    })

    if (!rental) {
        return res.status(404).send('Rental not found.')
    }

    if (rental.dateReturned) return res.status(400).send('return already process')


    rental.return()
    // rental.dateReturned = new Date()
    // rental.rentalFee = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate

    await rental.save()

    await Movie.update({
        _id: rental.movie._id
    }, {
        $inc: {
            numberInStock: 1
        }
    })



    return res.status(200).send(rental)

})




module.exports = router;