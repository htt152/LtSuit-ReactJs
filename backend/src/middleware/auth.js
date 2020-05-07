const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) => {
    try {
        
        const token = req.header('Authorization').replace('Basic ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        
        if(!user || user.role!==1){
            return res.status(403).send({error: 'Oop, Cant show this to you'})
        }
        next()
    } catch (e) {
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth