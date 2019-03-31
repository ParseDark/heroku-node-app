const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { Rental } = require('../models/rental')
const moment = require('moment');

router.post('/', auth, async (req, res) => {
    if(!req.body.customerId) res.status(400).send('customId unprovided.')
    if(!req.body.movieId) res.status(400).send('movieId unprovided.')

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    })

    if(!rental) {
        return res.status(404).send('Rental not found.')
    }

    if(rental.dateReturned) return res.status(400).send('return already process')

    rental.dateReturned = new Date()
    await rental.save()

    return res.status(200).send(rental)
 
})

module.exports = router;