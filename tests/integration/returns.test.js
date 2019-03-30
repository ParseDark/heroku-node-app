const request = require('supertest');
const { Rental } = require('../../models/rental')
const mongoose = require('mongoose')

describe('/api/returns', () => {
    let server
    let customerId
    let movieId
    let rental
    beforeEach(async () => {
        server = require('../../index')
        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()

        
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        })

        await rental.save()
    })

    afterEach(async () => {
        server.close()
        await Rental.remove({})
    })

    it('should work!', () => {
        const res = Rental.findById(rental._id)
        expect(res).not.toBeNull()
    })

    it('return 401 if client is not logged in', () => {


    })

})
// post /api/return {coustomerId, movieId}

// return 401 if client is not logged in

// return 400 if  customerId is not provided

// return 400 if movieId is not provided

// return 404 if not rental found for this customer/move

// return 400 if rental already processd

// return 200 if is valid request

//Set the return data

// Calculate the rental fee

// Increase the stock

// return the rental