const request = require('supertest');
const app = require('../../src/app');

test('Should return list team', async()=>{
    let testCase = [{
        teamEmail:"testemailforteam@gmail.com"
    },{
        teamEmail:"testemailforteam2@gmail.com"
    }]
    let response = await request(app)
        .get('/team-search')
    let teamArray = response.body.teamArray;
    for (var i = 0; i < testCase.length;i++){
        let result = teamArray.filter(e => e.teamEmail === testCase[i].teamEmail).length > 0
        expect(result).toBe(true)
    }
})

test('Should return teams', async()=>{
    let testCase = [{
        teamEmail:"teamhubcode2@gmail.com"
    },{
        teamEmail:"teamhubcode@gmail.com"
    }]
    let response = await request(app)
        .get('/team-search/h')
    let teamArray = response.body.teamArray;
    for (var i = 0; i < testCase.length;i++){
        let result = teamArray.filter(e => e.teamEmail === testCase[i].teamEmail).length > 0
        expect(result).toBe(true)
    }
})

test('Should return none', async()=>{
    let response = await request(app)
        .get('/team-search/tsd')
    let result = response.body.teamArray.length <= 0
    expect(result).toBe(true)
})

test('Should return team profile', async()=>{
    let testCase = {
        teamID : '5e843f828aeda30bf8658c07',
        teamAvatar : undefined,
        teamEmail : 'teamhubcode2@gmail.com',
        teamName : 'Test Hubcode 2',
        teamMembers : [ 
            {
                "_id" : "5e843f828aeda30bf8658c08",
                "userEmail" : "duydd@gmail.com",
                "userName" : "Dang Duy Duy"
            }, 
            {
                "_id" : "5e843f828aeda30bf8658c09",
                "userEmail" : "tetnm@gmail.com",
                "userName" : "Ngo Manh Tet"
            }
        ],
        loaiTeam : undefined,
        gioiThieu : undefined,
        deletedAt : undefined
    }
    let response = await request(app)
        .get('/teamProfile/5e843f828aeda30bf8658c07')
    expect(response.body._id).toBe(testCase.teamID)
    expect(response.body.teamAvatar).toBe(testCase.teamAvatar)
    expect(response.body.teamEmail).toBe(testCase.teamEmail)
    expect(response.body.teamName).toBe(testCase.teamName)
    expect(response.body.teamMembers).toStrictEqual(testCase.teamMembers)
    expect(response.body.loaiTeam).toBe(testCase.loaiTeam)
    expect(response.body.gioiThieu).toBe(testCase.gioiThieu)
    expect(response.body.deletedAt).toBe(testCase.deletedAt)
})

test('Should not return team profile', async()=>{
    let testCase = [
        '5e843f82aaeda30bf8658c07',
        '5e843f828aeda30b48658c07',
        '644c5308cd0642',
        'teamhubcode2@gmail.com'
    ]
    for (var i = 0; i < testCase.length; i++){
        await request(app)
        .get(`/teamProfile/${testCase[i]}`)
        .expect(400)
    }
})