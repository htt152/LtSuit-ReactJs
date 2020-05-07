const request = require('supertest');
const app = require('../../src/app');
const{clearDatabase,setupDatabase,userOneID,userTwoID,userThreeID,userFourID,userFiveID,userSixID} = require ('../fixtures/db');

test('Should logout user', async()=>{
    let testCase = [{
        username:"testingemail@gmail.com",
        password: "passtest"
    }]
    for (var i =0; i < testCase.length;i++){
        let response = await request(app)
            .post('/users/login')
            .send(
                {
                    username: testCase[i].username,
                    password: testCase[i].password
                }
            )
        await request(app)
            .post('/users/logout')
            .send({
                username: testCase[i].username,
            })
            .expect(200)
    }
})

test('Should not logout user', async()=>{
    let testCase = [{
        username:"testingemail@gmail.com",
        password: "passtest"
    }]
    for (var i =0; i < testCase.length;i++){
        let response = await request(app)
            .post('/users/login')
            .send(
                {
                    username: testCase[i].username,
                    password: testCase[i].password
                }
            )
        await request(app)
            .post('/users/logout')
            .send({
            })
            .expect(400)
    }
})