const request = require('supertest');
const moment = request('moment');
const {
    Rental
} = require('../../models/rental')
const {
    User
} = require('../../models/user')
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
        await server.close()
        await Rental.remove({})
    })

    let token
    const exec = async ({
        customerId,
        movieId
    }) => {
        return await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({
                customerId,
                movieId
            })
    }

    it('return 401 if client is not logged in', async () => {
        const res = await request(server).post('/api/returns').send({
            customerId: customerId,
            movieId: movieId
        })
        expect(res.status).toBe(401)
    })

    it('return 400 if customerId invalid.', async () => {
        token = new User().generateAuthToken()
        const res = await exec({
            movieId: movieId
        })
        expect(res.status).toBe(400)
    })

    it('return 400 if movieId is not provided', async () => {
        token = new User().generateAuthToken()
        const res = await exec({
            customerId
        })
        expect(res.status).toBe(400)
    })

    it('return 404 if not rental found for this customer/move', async () => {
        await Rental.remove({})
        token = new User().generateAuthToken()
        const res = await exec({
            customerId,
            movieId
        })
        expect(res.status).toBe(404)
    })

    it('return 400 if return is already processed.', async () => {
        rental.dateReturned = new Date()
        await rental.save()
        token = new User().generateAuthToken()
        const res = await exec({
            customerId,
            movieId
        })
        expect(res.status).toBe(400)
    })

    it('return 200 if is valid request', async () => {
        token = new User().generateAuthToken()
        const res = await exec({
            customerId,
            movieId
        })
        expect(res.status).toBe(200)
    })


    it('Set the return data', async () => {

        token = new User().generateAuthToken()
        const res = await exec({
            customerId,
            movieId
        })

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.dateReturned).toBeDefined()
    })

    // it('Calculate the rental fee', async () => {
    //     rental.dateOut = moment().add(-7, 'days').toDate()
    //     await rental.save()


    //     token = new User().generateAuthToken()
    //     const res = await exec({
    //         customerId,
    //         movieId
    //     })

    //     const rentalInDb = await Rental.findById(rental._id)

    //     expect(rentalInDb.rentalFee).toBeDefined()
    //     expect(rentalInDb.rentalFee).toBe(14)
    // })



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