const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const teamRouter = require('./routers/team')
const nghiPhepRouter = require('./routers/nghiPhep')
const bangDiemRouter = require('./routers/bangDiem')
const roleRouter = require('./routers/role')
const thanhVienRouter = require('./routers/thanhVien')
const hoatDongCaNhanRouter = require('./routers/hoatDongCaNhan')
const bodyParser = require('body-parser')
const cors = require('cors');


const app = express()

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.json())
app.use(userRouter)
app.use(teamRouter)
app.use(nghiPhepRouter)
app.use(bangDiemRouter)
app.use(roleRouter)
app.use(hoatDongCaNhanRouter)
app.use(thanhVienRouter)

module.exports = app