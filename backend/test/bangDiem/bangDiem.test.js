const request = require('supertest')
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const app = require('../../src/app');
const Bangdiem = require('../../src/models/bangDiem')

const userOneId = new mongoose.Types.ObjectId()

const userAdm = {
  name: 'hubcodeAdmin',
  email: 'hubcodeAdmin@gmail.com',
  password: '123456@',
  tokens: [{
      token: jwt.sign(process.env.JWT_SECRET)
  }]
}

test('Test bang diem day du thong tin ca nhan', async () => {
  await request(app)
  .post('/bangdiem/create')
  .send(
      {
        "userName": "cuongtest",
        "userEmail": "testemail@gmail.com",
        "name": "cuong",
        "learningPoints": 100,
        "basedPoints": 10,
        "danhSach": [{
              "hoatDongID":"",
              "title": "giao tiep hieu qua",
              "type": "tham gia cac hoat dong ren luyen ky nang trong cong ty",
              "description": "Dien gia Thuonglt Dia diem Hiroshima Thoi gian: 10h 30 ngay 25/03/2019",
              "date": "25-03-2019",
              "status": "appoved",
              "point": "100"
        }]
      }
  ).expect(201)
 })

test('Test bang diem khong day du ca nhan', async () => {
  await request(app)
  .post('/bangdiem/create')
  .send(
      {
             "userName": "test 2",
             "userEmail": "test2@gmail.com",
             "name": "cuong",
             "learningPoints": 100,
             "basedPoints": 10,
             "danhSach": [{
                         "hoatDongID":"",
                         "title": "", //invalid title
                         "type": "", //invalid type
                         "description": "phong tokyo",
                         "date": "25-03-2019",
                         "status": "pending",
                         "point": "100"
                       }
                     ]
      }
  ).expect(400)
})

test('Test bang diem khong day du thong tin ca nhan', async () => {
  await request(app)
  .post('/bangdiem/create')
  .send(
      {
             "userName": "test 2",
             "userEmail": "test2@gmail.com",
             "name": "cuong",
             "learningPoints": 100,
             "basedPoints": 10,
             "danhSach": [{
                         "hoatDongID":"",
                         "title": "dien gia PHP",
                         "type": "Semina",
                         "description": "Phong Hiroshima",
                         "date": "",  //invalid date
                         "status": "pending",
                         "point": "100"
                       }
                     ]
      }
  ).expect(400)
})

test('Test bang diem khong day du thong tin ca nhan', async () => {
  await request(app)
  .post('/bangdiem/create')
  .send(
      {
             "userName": "test 2",
             "userEmail": "test2@gmail.com",
             "name": "cuong",
             "learningPoints": 100,
             "basedPoints": 10,
             "danhSach": [{
                         "hoatDongID":"20",
                         "title": "learn switch", 
                         "type": "training",
                         "description": "Phong Ozawa",
                         "date": "25-03-2019",
                         "status": "pending",
                         "point": "" //Invalid point
                       }
                     ]
      }
  ).expect(400)
})
test('Test lay bang diem admin', async () => {
  await request(app)
  .get('/bangdiem/admin')
  .set('Authorization', `Bearer ${userAdm.tokens[0].token}`)
  .send().expect(200)
 })

test('Test lay bang diem admin', async () => {
  await request(app)
  .get('/bangdiem/admin')
  .set("")
  .send().expect(400)
})

const getDanhSachDiem = async (email) => {
  const bangdiem = await BangDiem.findOne({userEmail: email})
  if (bangdiem){
      return bangdiem.danhSach
  }
  else {
      return []
  }
}
// bang diem email
test('Test lay bang diem', async () => {
  const test = { userEmail: "example@com.vn" }

  await request(app)
  .get(`/bangdiem/${test.usrEmail}`)
  .send()
  .expect(200)
})

test('Test lay bang diem false', async () => {  
  await request(app)
  .get('/bangdiem/')
  .send()
  .expect(200)
})

test('Test bang diem user admin', async () => {
  await request(app)
  .get('/bangdiem/admin')
  .set('Authorization', `Bearer ${userAdm.tokens[0].token}`)
  .send()
  .expect(200)
})

test('Test bang diem user admin', async () => {
  await request(app)
  .get('/bangdiem/admin')
  .set("")
  .send()
  .expect(400)
})

// Email
test('Test xoa bang diem', async () => {
  const test = { 
                  userEmail: "toiladong1998@com.vn",
                  _id: userId  
                }
  await request(app)
  .delete('/bangdiem/delete')
  .send({ 
    userEmail: "toiladong1998@com.vn",
    _id: userId  
  })
  .expect(200)
})


test('Test xoa bang diem', async () => {
  await request(app)
  .delete('/bangdiem/delete')
  .send("")
  .expect(400)
})