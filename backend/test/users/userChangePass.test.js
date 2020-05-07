const request = require('supertest');
const app = require('../../src/app');
const{clearDatabase,setupDatabase,userOneID,userTwoID,userThreeID,userFourID,userFiveID,userSixID} = require ('../fixtures/db');


test('Should change password', async() => {
    let testCase = [{
        username:"testingemail@gmail.com",
        newPass:"dasdasdasda"
    },{
        username:"testemail@gmail.com",
        newPass:"dasdasdasda"
    },{
        username:"test-email@gmail.com",
        newPass:"dasdasdasda"
    },{
        username:"test_email_number4@gmail.com",
        newPass:"dasdasdasda"
    }]
    for (var i =0 ; i < testCase.length;i++){
        await request(app)
            .patch(`/users/change?email=${testCase[i].username}`)
            .send(
                {
                    password: testCase[i].newPass
                }
            )
            .expect(200)
        await request(app)
            .post('/users/login')
            .send(
                {
                    username: testCase[i].username,
                    password: "passtest"
                }
            )
            .expect(400)
        let response = await request(app)
            .patch(`/users/change?email=${testCase[i].username}`)
            .send(
                {
                    password: "passtest"
                }
            )
            .expect(200)
    }
})

test('Should not change password', async() => {
    let testCase = [{
        username:"testingemail@gmail.com",
        newPass:""
    },{
        username:"testemail@gmail.com",
        newPass:"1235"
    },{
        username:"test-email@gmail.com",
        newPass:"dasdasdasdadsakjdashdshkdjaskjdhasdgashjklgfyguhjikjfdtyujknbvghyuijbguijkhghuijknbuikjnbjguikjnbgujyujj"
    },{
        username:"test_email_number4@gmail.com",
        newPass:" a "
    },{
        username:"dasdasdsadasdas",
        newPass:"1234568954"
    },{
        username:"toiladong19981@gmail.com",
        newPass:"123456"
    },{
        username:"",
        newPass:"123456"
    }]
    for (var i =0 ; i < testCase.length;i++){
        let response = await request(app)
            .patch(`/users/change?email=${testCase[i].username}`)
            .send(
                {
                    password: testCase[i].newPass
                }
            )
            .expect(400)
    }
})