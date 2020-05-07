const express = require('express')
const bcrypt = require('bcryptjs')
var multer  = require('multer')
const path = require('path')
const fs = require('fs')
const User = require('../models/user')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const {sendForgotPassword} = require('../emails/account')
const router = new express.Router()
const NghiPhep = require('../models/nghiPhep')
const BangDiem = require('../models/bangDiem')
const Team = require('../models/team')

router.post('/users/create',async (req,res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login',async (req,res) => {
    try {
        let user
        const filter = /^[a-z][a-z0-9_\.!-]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/
        if (filter.test(req.body.username)){
            user = await User.findOne({email: req.body.username})
        }
        else{
            if(req.body.username.length < 6){
                res.status(400).send({error: 'Username minimum is 6'})
            }else if(req.body.username.length > 32){
                res.status(400).send({error: 'Username maximum is 32'})
            }
            user = await User.findOne({username: req.body.username})
        }
        if(!user){
            res.status(400).send({error: 'Username or email not found!'})
        }
        if(req.body.password.length < 6){
            res.status(400).send({error: 'Password minimum is 6'})
        }else if(req.body.password.length > 32){
            res.status(400).send({error: 'Password maximum is 32'})
        }
        const isMatch = await bcrypt.compare(req.body.password,user.password)
        if(!isMatch){
            res.status(400).send({error: 'Wrong Password'})
        }

        const token = await user.generateAuthToken()
        res.send({user, token})
        
    } catch (error) {
        return res.status(400)
    }
})

router.post('/users/logout', async (req,res) => {
    try {
        const user = await User.findOne({email: req.body.username})
        if (!user){
            return res.status(400).send({error : "Missing value"})
        }
        user.tokens = user.tokens.filter((token) => {
            return token.token !== req.body.token
        })

        await user.save()

        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/sendemail',async (req,res) => {
    try {
        const filter = /^[a-z][a-z0-9_\.!-]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/
        if (filter.test(req.body.email)){
            const user = await User.findOne({email: req.body.email})
            if(!user){
                res.status(400).send({error: 'Email not found!'})
            }
            const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET,{ expiresIn: 12*60*60 })
            user.tokens[0] = {token}
            await user.save()
            sendForgotPassword(req.body.email,user._id,token,user.name)
            res.status(200).send()
        }else{
            res.status(400).send({error: 'Email format is incorrect!'})
        }
        
    } catch (e) {
        res.status(400).send()
    }
})

router.patch('/users/change',async (req,res) => {
    try {
        const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET)
        if(!decoded){
            res.status(401).send({error: 'The token has expired!'})
        }
        const user = await User.findOne({_id: decoded._id, 'tokens.token': req.body.token})

        if (!user){
            res.status(401).send({error: 'The token has expired!'})
        }
        if(req.body.password.length < 6){
            res.status(400).send({error: 'Password minimum is 6'})
        }else if(req.body.password.length > 32){
            res.status(400).send({error: 'Password maximum is 32'})
        }
        else{
            user.password = req.body.password
            user.tokens = user.tokens.filter((token) => {
                return token.token !== req.body.token
            })
            await user.save()
            res.status(200).send()
        }
    } catch (e) {
        res.status(401).send({error: 'The token has expired!'})
    }
})

router.get('/users',async (req,res) => {
    try {
        const user = await User.find()
        res.send(user)
    } catch (error) {
        res.send(error)
    }
})

router.post('/users',async (req,res) => {
    try {
        const user = await User.findOne({_id: req.body.id})
        if(!user){
            res.status(400).send({error: '400'})
        }

        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logoutAll', auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/user', async(req,res)=>{
    try {
        let user = await User.findOne({email: req.body.email})
        if (!user){
            user = await User.findOne({username: req.body.username})
            if (!user){
                return res.status(400).send({error: 'User not found'})
            }
        }
            for (var i = 0; i < user.tokens.length;i++){
                if (user.tokens[i].token === req.body.token){
                    return res.status(200).send("Found")
                }
            }
            return res.status(400).send({error: 'Token not found'})
    } catch (error) {
        return res.status(400)
    }
})

const validate = (req) =>{
    const filter = /^[a-z][a-z0-9_\.!-]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/
    if (!filter.test(req.email)){
        return {
            isValid: false,
            errorMessage: "Email khong hop le"
        }
    }
    if(req.password.length < 6 && req.password.length > 0){
        return {
            isValid: false,
            errorMessage: "Password phai lon hon 6 ky tu"
        }
    }

    if(req.password.length > 32){
        return {
            isValid: false,
            errorMessage: "Password phai be hon 32 ky tu"
        }
    }
    return {
        isValid: true
    };
}

router.patch('/users/changeInformation',async (req,res) => {
    try {
        const user = await User.findOne({_id: req.body._id})
        
        if (!user){
            res.status(400).send({error: 'Khong tim thay user'})
        }
        let formValidate = validate(req.body);
        if (formValidate.isValid){
            if (user.email != req.body.email){
                let dupMailCheck = await User.findOne({email: req.body.email})
                if (dupMailCheck){
                    return res.status(400).send("Email da ton tai")
                }
                let foundInNghiPhep = await NghiPhep.findOne({userEmail: user.email})
                if (foundInNghiPhep){
                    foundInNghiPhep.userEmail = req.body.email;
                    await foundInNghiPhep.save()
                }
                let foundInBangDiem = await BangDiem.findOne({userEmail: user.email})
                if (foundInBangDiem){
                    foundInBangDiem.userEmail = req.body.email;
                    if (foundInBangDiem.name != req.body.name){
                        foundInBangDiem.name = req.body.name
                    }
                    await foundInBangDiem.save()
                }
                let teamArray = await Team.find({})
                for (var i = 0; i < teamArray.length; i++){
                    let teamMembers = teamArray[i].teamMembers;
                    for (var j = 0; j < teamMembers.length; j++){
                        if (teamMembers[j].userEmail === user.email){
                            teamMembers[j].userEmail = req.body.email;
                            if (teamMembers[j].userName != req.body.name){
                                teamMembers[j].userName = req.body.name
                            }
                            await teamArray[i].save()
                        }
                    }
                }    
            }
            if(req.body.password.length > 0){
                user.password = req.body.password
            }
            user.name = req.body.name,
            user.email = req.body.email,
            user.avatar = req.body.avatar,
            user.gioiThieu = req.body.gioiThieu,
            user.diaChi = req.body.diaChi,
            user.phone = req.body.phone,
            user.ngaySinh = req.body.ngaySinh,
            user.gioiTinh = req.body.gioiTinh,
            user.phanLoai = req.body.phanLoai,
            user.nghiepVu = req.body.nghiepVu,
            user.kyNang = req.body.kyNang
            let response = await user.save();
            return res.status(200).send(response)
        }
        else{
            return res.status(400).send(formValidate.errorMessage)
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

const upload = multer({
    dest: "avatar",
    limits: {
        fileSize: 10000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/avatar', upload.single('avatar'),async (req, res) => {
    if(!req.file){
        return res.send()
    }
    const processedFile = req.file;
    let orgName = processedFile.originalname || '';
    orgName = orgName.trim().replace(/ /g, "-")
    const fullPathInServ = processedFile.path;
    const newFullPath = `${fullPathInServ}-${orgName}`;
    fs.renameSync(fullPathInServ, newFullPath);
    res.send({
        status: true,
        message: 'file uploaded',
        fileNameInServer: newFullPath
    })
})

router.post('/avatar',async (req,res) => {
    try {
        
        const email = req.body.email
        const filter = /^[a-z][a-z0-9_\.!-]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/
        if (!filter.test(email)){
            return res.status(400).send({error: "Email không hợp lệ!"})
        }else if(!email){
            return res.status(400).send({error: "Không tìm thấy email!"})
        }else{
            const user = await User.findOne({email})
            if(!user){
                return res.status(400).send({error: "Không tìm thấy user!"})
            }else{
                user.avatar = req.body.avatar
                await user.save()
                return res.status(200).send()
            }
        }
        
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/avatar/:name', (req, res) => {
    const fileName = req.params.name;
    if (!fileName) {
        return res.send({
            status: false,
            message: 'no filename specified',
        })
    }
    res.sendFile(path.resolve(`./avatar/${fileName}`));
})

module.exports = router
