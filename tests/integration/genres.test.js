const request = require('supertest');
let server
const {
    Genre
} = require('../../models/genre')
const {
    User
} = require('../../models/user')
const mongoose = require('mongoose')


describe('/api/genres', () => {

    beforeEach(() => {
        server = require('../../index')
    })

    afterEach(async () => {
        await Genre.remove({})
        server.close()
    })

    describe('GET /', () => {

        it('should return all genres', async () => {
            await Genre.collection.insertMany([{
                    name: 'ggg1'
                },
                {
                    name: 'ggg2'
                }
            ])
            const res = await request(server).get('/api/genres')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.name === 'ggg1')).toBeTruthy()
            expect(res.body.some(g => g.name === 'ggg2')).toBeTruthy()
        })
    })

    describe('GET /:id', () => {
        it('should return a genre if vali id is passed', async () => {
            const genre = new Genre({
                name: 'gggg1'
            })
            await genre.save()
            const res = await request(server).get('/api/genres/' + genre._id)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', genre.name)
        })

        it('should return 404 if invali id is passed', async () => {
            const res = await request(server).get('/api/genres/1')
            expect(res.status).toBe(404)
        })

        it('should return 404 if invali id is passed', async () => {
            const id = mongoose.Types.ObjectId()

            const res = await request(server).get('/api/genres/' + id)
            expect(res.status).toBe(404)
        })
 
    })

    describe('POST /', () => {

        // 重构测试内容： 把相同部分抽象成为函数
        let token
        const exec = async (name) => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({
                    name: name
                })
        }

        beforeEach(() => {
            token = new User().generateAuthToken()
        })


        it('should return 401 if client is not logged in', async () => {
            token  = ''
            const res = await exec('gggg1')

            expect(res.status).toBe(401)
        })

        it('should return 400 if genres is less then 5 characters', async () => {
            const res = await exec('ggg1')
            expect(res.status).toBe(400)
        })

        it('should return 400 if genres is more then 50 characters', async () => {
            const token = new User().generateAuthToken()
            const name = new Array(52).join('a')

            const res = await exec(name)

            expect(res.status).toBe(400)
        })


        it('should save the genera if it is valid', async () => {
            const res = await exec('gggg1')

            const genres = await Genre.find({
                name: 'gggg1'
            })

            expect(genres).not.toBeNull()
        })

        it('should return genera if it is valid', async () => {

            const res = await exec('gggg1')

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name')
        })


    })
})