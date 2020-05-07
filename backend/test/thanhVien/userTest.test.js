const request = require('supertest');
const app = require('../../src/app');

test('Should return list user', async()=>{
    let testCase = [{
        userEmail:"namdv@gmail.com"
    },{
        userEmail:"thipv@gmail.com"
    }]
    let response = await request(app)
        .get('/thanhvien-search')
    let userArray = response.body.userArray;
    for (var i = 0; i < testCase.length;i++){
        let result = userArray.filter(e => e.userEmail === testCase[i].userEmail).length > 0
        expect(result).toBe(true)
    }
})

test('Should return users', async()=>{
    let testCase = [{
        userEmail:"dattt@gmail.com"
    },{
        userEmail:"thipv@gmail.com"
    },{
        userEmail:"thangld@gmail.com"
    }]
    let response = await request(app)
        .get('/thanhvien-search/t')
    let userArray = response.body.userArray;
    for (var i = 0; i < testCase.length;i++){
        let result = userArray.filter(e => e.userEmail === testCase[i].userEmail).length > 0
        expect(result).toBe(true)
    }
})

test('Should return none', async()=>{
    let response = await request(app)
        .get('/thanhvien-search/tsda')
    let result = response.body.userArray.length <= 0
    expect(result).toBe(true)
})

test('Should return current user profile', async()=>{
    let testCase = {
        _id : '5e69ffa6b666ae3624cc20a5',
        avatar : undefined,
        email : 'thangld@gmail.com',
        name : 'Ly Doan Thang',
        teams : [],
        kyNang : undefined,
        role : 0
    }
    let response = await request(app)
        .get('/profile')
        .send({
            email: 'thangld@gmail.com'
        })
    expect(response.body._id).toBe(testCase._id)
    expect(response.body.avatar).toBe(testCase.avatar)
    expect(response.body.email).toBe(testCase.email)
    expect(response.body.name).toBe(testCase.name)
    expect(response.body.teams).toStrictEqual(testCase.teams)
    expect(response.body.kyNang).toBe(testCase.kyNang)
    expect(response.body.role).toBe(testCase.role)
})

test('Should not return current user profile', async()=>{
    await request(app)
        .get('/profile')
        .send({
            email: 'thangsadld@gmail.com'
        })
        .expect(400)
})

test('Should return user profile', async()=>{
    let testCase = {
        _id : '5e6a003292644c5308cd0641',
        avatar : undefined,
        email : 'thanhvt@gmail.com',
        name : 'Vu Tay Thanh',
        teams : [],
        kyNang : undefined,
        role : 0
    }
    let response = await request(app)
        .get('/profile/5e6a003292644c5308cd0641')
    expect(response.body._id).toBe(testCase._id)
    expect(response.body.avatar).toBe(testCase.avatar)
    expect(response.body.email).toBe(testCase.email)
    expect(response.body.name).toBe(testCase.name)
    expect(response.body.teams).toStrictEqual(testCase.teams)
    expect(response.body.kyNang).toBe(testCase.kyNang)
    expect(response.body.role).toBe(testCase.role)
})

test('Should not return user profile', async()=>{
    let testCase = [
        '5e6a003292674c5308cd0642',
        '5e6a00329a644c5308cd0642',
        '644c5308cd0642',
        'testemail@gmail.com'
    ]
    for (var i = 0; i < testCase.length; i++){
        await request(app)
        .get(`/profile/${testCase[i]}`)
        .expect(400)
    }
})

