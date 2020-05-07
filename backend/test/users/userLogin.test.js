const request = require('supertest');
const app = require('../../src/app');
const{clearDatabase,setupDatabase,userOneID,userTwoID,userThreeID,userFourID,userFiveID,userSixID} = require ('../fixtures/db');

test('Should log in user', async()=>{
    let testCase = [{
        id:  userOneID,
        username:"minh231user"
    },{
        id:  userOneID,
        username:"testingemail@gmail.com"
    },{
        id:  userTwoID,
        username:"minh567user"
    },{
        id:  userTwoID,
        username:"testemail@gmail.com"
    },{
        id:  userThreeID,
        username:"user3login"
    },{
        id:  userThreeID,
        username:"test-email@gmail.com"
    },{
        id:  userFourID,
        username:"user_4_user"
    },{
        id:  userFourID,
        username:"test_email_number4@gmail.com"
    },{
        id:  userFiveID,
        username:"user-5-"
    },{
        id:  userFiveID,
        username:"user5-5-5-@gmail.com"
    },{
        id:  userSixID,
        username:"user!6!"
    },{
        id:  userSixID,
        username:"user!-6-!@gmail.com.vn"
    }]
    for (var i =0 ; i < testCase.length;i++){
        await request(app)
            .post('/users/login')
            .send(
                {
                    username: testCase[i].username,
                    password: 'passtest'
                }
            )
            .expect(200)
    }
})

test('Should not login user with invalid password', async()=>{
    let testCase = [{
        username:"testingemail@gmail.com",
        password:""
    },{
        username:"minh231user",
        password:""
    },{
        username:"testingemail@gmail.com",
        password:"81"
    },{
        username:"testingemail@gmail.com",
        password:"12535753215953215756210789asdvxchuasgdishdisgdhidhsuiahdisah"
    }]
    for (var i =0; i < testCase.length;i++){
        await request(app)
            .post('/users/login')
            .send({
                username: testCase[i].username,
                password: testCase[i].password
            })
            .expect(400)
    }
})

test('Should not login user with invalid email and login', async()=>{
    let testCase = [{
        username:"                    ",
    },{
        username:"                    @gmail.com"
    }]
    for (var i =0; i < testCase.length;i++){
        await request(app)
            .post('/users/login')
            .send({
                username: testCase[i].username,
                password: 'passtest'
            })
            .expect(400)
    }
})

test('Should not login non exit user', async()=>{
    let testCase = [{
        username:"randomemail@gmail.com",
        password: "1"
    },{
        username:"randomemail",
        password: "1"
    }]
    for (var i =0; i < testCase.length;i++){
        await request(app)
            .post('/users/login')
            .send({
                username: testCase[i].username,
                password: testCase[i].password
            })
            .expect(400)
    }
})