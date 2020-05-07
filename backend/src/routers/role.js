const express = require('express')
const Role = require("../models/role")
const router = new express.Router()
const auth = require('../middleware/auth')
router.post('/role/create',async (req,res) => {
    const role = new Role(req.body)
    try {
        const exitRole = await Role.findOne({roleName: req.body.roleName})
        if(exitRole){
            return res.status(400).send("Role đã tồn tại!")
        }
        await role.save()
        res.status(201).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router