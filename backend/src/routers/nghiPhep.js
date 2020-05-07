const express = require('express')
const NghiPhep = require('../models/nghiPhep')
const Team = require('../models/team')
const router = new express.Router()
const User = require('../models/user')
const { sendNghiPhep, sendNghiPhepUser } = require('../emails/account')
const TinhPhepTon = require('../utilities/TinhPhepTon')

router.get('/nghiphep/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const foundList = await NghiPhep.findOne({ userEmail: email })
        if (!foundList) {
            return res.status(404).send();
        }
        let returnArray = []
        for (var i = 0; i < foundList.nghiPhep.length; i++) {
            let value = foundList.nghiPhep[i].toObject()
            returnArray.push(value)
        }
        res.send(returnArray)
    } catch (e) {
        res.status(500).send()
    }
})

const validateForm = async (req) => {
    let exitUser = await User.findOne({ email: req.userEmail });
    if (!exitUser) {
        return {
            isValid: false,
            errorMessage: "Khong ton tai user"
        }
    }
    if (req.userName != exitUser.username) {
        return {
            isValid: false,
            errorMessage: "Khong ton tai user"
        }
    }
    if (req.nghiPhep[0].nghiTu > req.nghiPhep[0].nghiDen) {
        return {
            isValid: false,
            errorMessage: "Nghi tu phai dien ra truoc nghi den"
        }
    }
    if (req.nghiPhep[0].lyDoNghi.replace(/ /g, "").length == 0 ||
        req.nghiPhep[0].lyDoNghi.length >= 500) {
        return {
            isValid: false,
            errorMessage: "Ly do nghi khong hop le"
        }
    }
    if (req.nghiPhep[0].phuongAnKhacPhuc.length >= 500) {
        return {
            isValid: false,
            errorMessage: "Phuong an khac phuc khong hop le"
        }
    }
    if (req.nghiPhep[0].mucDoAnhHuong.replace(/ /g, "").length == 0) {
        return {
            isValid: false,
            errorMessage: "Muc do anh huong khong hop le"
        }
    }
    return {
        isValid: true
    }
}

const dateFormat = d => {
    let date = new Date(d)
    let year = date.getFullYear()
    let month = (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1)
    let day = (date.getDate() < 10 ? "0" : "") + date.getDate()
    let hour = (date.getHours() < 10 ? "0" : "") + date.getHours()
    let minute = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
    return `${day}/${month}/${year} ${hour}:${minute}`
}

router.post('/nghiphep/create', async (req, res) => {
    try {
        const nghiPhep = new NghiPhep(req.body)
        let formValid = await validateForm(nghiPhep)
        if (!formValid.isValid) {
            return res.status(400).send(formValid.errorMessage)
        }
        let response
        const daNghiPhep = await NghiPhep.findOne({ userEmail: nghiPhep.userEmail });
        if (!daNghiPhep) {
            userExited = false;
            nghiPhep.nghiPhep[0].tongThoiGianNghi = calculateTime(nghiPhep.nghiPhep[0].nghiTu, nghiPhep.nghiPhep[0].nghiDen);
            nghiPhep.nghiPhep[0].phepTon = 96 - nghiPhep.nghiPhep[0].tongThoiGianNghi;
            response = await nghiPhep.save()
        }
        else {
            let querry = { userEmail: nghiPhep.userEmail }
            daNghiPhep.nghiPhep.push(nghiPhep.nghiPhep[0])
            daNghiPhep.nghiPhep[daNghiPhep.nghiPhep.length - 1].tongThoiGianNghi = calculateTime(daNghiPhep.nghiPhep[daNghiPhep.nghiPhep.length - 1].nghiTu, daNghiPhep.nghiPhep[daNghiPhep.nghiPhep.length - 1].nghiDen);
            daNghiPhep.nghiPhep[daNghiPhep.nghiPhep.length - 1].phepTon = daNghiPhep.nghiPhep[daNghiPhep.nghiPhep.length - 2].phepTon - daNghiPhep.nghiPhep[daNghiPhep.nghiPhep.length - 1].tongThoiGianNghi;
            let newData = { $set: { nghiPhep: daNghiPhep.nghiPhep } }
            response = await NghiPhep.update(querry, newData)
        }


        let email = [req.body.userEmail]
        let user = []
        const nghi = req.body.nghiPhep[0]
        const emails = nghi.benLienQuan
        if (emails.teamLienQuan) {
            for (var i = 0; i < emails.teamLienQuan.length; i++) {
                const list = await Team.findOne({ teamName: emails.teamLienQuan[i].teamName })
                for (var j = 0; j < list.teamMembers.length; j++) {
                    if (!email.includes(list.teamMembers[j].userEmail)) {
                        email.push(list.teamMembers[j].userEmail)
                        user.push(list.teamMembers[j].userName)
                    }
                }
            }
        }

        if (emails.nguoiLienQuan) {
            for (var k = 0; k < emails.nguoiLienQuan.length; k++) {
                if (!email.includes(emails.nguoiLienQuan[k].userEmail)) {
                    email.push(emails.nguoiLienQuan[k].userEmail)
                    user.push(emails.nguoiLienQuan[k].userName)
                }
            }
        }


        email.shift()

        sendNghiPhepUser(
            req.body.userEmail,
            req.body.userName,
            dateFormat(nghi.nghiTu),
            dateFormat(nghi.nghiDen),
            nghi.lyDoNghi,
            email,
            nghi.mucDoAnhHuong,
            nghi.phuongAnKhacPhuc
        )

        for (var l = 0; l < email.length; l++) {
            sendNghiPhep(
                email[l],
                user[l],
                req.body.userName,
                dateFormat(nghi.nghiTu),
                dateFormat(nghi.nghiDen),
                nghi.lyDoNghi,
                email,
                nghi.mucDoAnhHuong,
                nghi.phuongAnKhacPhuc
            )
        }

        return res.status(201).send(response)
    } catch (e) {
        return res.status(400).send("aasdasd")
    }
})

router.get('/layphepton/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const foundList = await NghiPhep.findOne({ userEmail: email })
        if (!foundList) {
            return res.status(200).send({ phepTon: 96 });
        }
        let value = foundList.nghiPhep[foundList.nghiPhep.length - 1];
        let phepTon = value.phepTon;
        res.status(200).send({ phepTon })
    } catch (e) {
        res.status(400).send(e)
    }
})

const calculateTime = (nghiTu, nghiDen) => {
    return TinhPhepTon(nghiTu, nghiDen);
}

module.exports = router
