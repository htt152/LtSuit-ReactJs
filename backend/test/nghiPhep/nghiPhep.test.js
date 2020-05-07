const request = require('supertest')
const app = require('../../src/app')


test('Dang ki nghi phep thanh cong', async () => {
    await request(app)
        .post('/nghiphep/create')
        .send(
            {
                "userEmail": "testemail@gmail.com",
                "userName": "minh567user",
                "nghiPhep": [{
                    "nghiTu": "2020-03-20T16:00:00Z",
                    "nghiDen": "2020-03-21T16:00:00Z",
                    "lyDoNghi": "Nghi om",
                    "benLienQuan": {},
                    "mucDoAnhHuong": "Khong anh huong",
                    "phuongAnKhacPhuc": "",
                    "tongThoiGianNghi": 0
                }]
            }
        )
        .expect(201)
})

test('Nghi phep that bai username invalid', async () => {
    await request(app)
        .post('/nghiphep/create')
        .send(
            {
                "userEmail": "testemail@gmail.com",
                "userName": "",  //username invalid
                "nghiPhep": [{
                    "nghiTu": "2020-03-20T16:00:00Z",
                    "nghiDen": "2020-03-21T16:00:00Z",
                    "lyDoNghi": "Nghi om",
                    "benLienQuan": {},
                    "mucDoAnhHuong": "Khong anh huong",
                    "phuongAnKhacPhuc": "",
                    "tongThoiGianNghi": 0
                }]
            }
        )
        .expect(400)
})
test('Nghi phep that bai useremail invalid', async () => {
    await request(app)
        .post('/nghiphep/create')
        .send(
            {
                "userEmail": "",//useremail invalid
                "userName": "minh567user    ",  
                "nghiPhep": [{
                    "nghiTu": "2020-03-20T16:00:00Z",
                    "nghiDen": "2020-03-21T16:00:00Z",
                    "lyDoNghi": "Nghi om",
                    "benLienQuan": {},
                    "mucDoAnhHuong": "Khong anh huong",
                    "phuongAnKhacPhuc": "",
                    "tongThoiGianNghi": 0
                }]
            }
        )
        .expect(400)
})

test('Nghi phep that bai lydo nghi invalid ', async () => {
    await request(app)
        .post('/nghiphep/create')
        .send(
            {
                "userEmail": "testemail@gmail.com",
                "userName": "minh567user",
                "nghiPhep": [{
                    "nghiTu": "2020-03-20T16:00:00Z",
                    "nghiDen": "2020-03-21T16:00:00Z",
                    "lyDoNghi": "", //invalid
                    "benLienQuan": {},
                    "mucDoAnhHuong": "Khong anh huong",
                    "phuongAnKhacPhuc": "",
                    "tongThoiGianNghi": 0
                }]
            }
        )
        .expect(400)
})

test('Nghi phep that bai muc do anh huong invalid', async () => {
    await request(app)
        .post('/nghiphep/create')
        .send(
            {
                "userEmail": "testemail@gmail.com",
                "userName": "minh567user",
                "nghiPhep": [{
                    "nghiTu": "2020-03-20T16:00:00Z",
                    "nghiDen": "2020-03-21T16:00:00Z",
                    "lyDoNghi": "Nghi om",
                    "benLienQuan": {},
                    "mucDoAnhHuong": "", // invalid
                    "phuongAnKhacPhuc": "",
                    "tongThoiGianNghi": 0
                }]
            }
        )
        .expect(400)
})

test('Nghi phep that bai ngay nghi invalid', async () => {
    await request(app)
        .post('/nghiphep/create')
        .send(
            {
                "userEmail": "testemail@gmail.com",
                "userName": "minh567user",
                "nghiPhep": [{
                    "nghiTu": "2020-04-20T16:00:00Z", // invalid
                    "nghiDen": "2020-03-21T16:00:00Z",
                    "lyDoNghi": "Nghi om",
                    "benLienQuan": {},
                    "mucDoAnhHuong": "Khong",
                    "phuongAnKhacPhuc": "",
                    "tongThoiGianNghi": 0
                }]
            }
        )
        .expect(400)
})