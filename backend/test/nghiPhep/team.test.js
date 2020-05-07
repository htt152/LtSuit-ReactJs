const request = require('supertest')
const app = require('../../src/app')

test('Tao team thanh cong', async () => {
    await request(app)
        .post('/teams/create')
        .send(
            {
                "teamName": "Team Hubcode",
                
            }
        )
        .expect(201)
})

test('Tao team that bai - teamName invalid', async () => {
    await request(app)
        .post('/teams/create')
        .send(
            {
                "teamName": "", //invalid
                
            }
        )
        .expect(400)
})

test('Tao team that bai - team da ton tai', async () => {
    await request(app)
        .post('/teams/create')
        .send(
            {
                "teamName": "Team Hubcode",
                
            }
        )
        .expect(400)
})