const request = require('supertest')
let server
const {
    User
} = require('../../models/user')
const {
    Genre
} = require('../../models/genre')



describe('auth middleware', () => {
    beforeEach(() => {
        token = new User().generateAuthToken()
        server = require('../../index')
    })

    afterEach(async () => {
        await Genre.remove({})
        await server.close()
    })

    let token
    const exec = async (name) => {
        return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({
                name: name
            })
    }

    it('should return 401 if no token is provided.', async () => {
        token = ''
        const res = await exec('gggg1')
        expect(res.status).toBe(401)
    })

    it('should return 400 if token is invalid.', async () => {
        token = 'a'
        const res = await exec('gggg1')
        expect(res.status).toBe(400)
    })

    it('should return 200 if token is valid.', async () => {
        const res = await exec('gggg1')
        expect(res.status).toBe(200)
    })


})