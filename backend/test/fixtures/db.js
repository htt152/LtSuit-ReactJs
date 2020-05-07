const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')

const userOneID =   new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneID,
    name: 'user1',
    username: 'minh231user',
    email: 'testingemail@gmail.com',
    password: 'passtest',
    tokens:[{
        token: jwt.sign({_id: userOneID}, process.env.JWT_SECRET)
    }]
}

const userTwoID = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoID,
    name: 'user2',
    username: 'minh567user',
    email: 'testemail@gmail.com',
    password: 'passtest',
    tokens:[{
        token: jwt.sign({_id: userTwoID}, process.env.JWT_SECRET)
    }]
}

const userThreeID = new mongoose.Types.ObjectId();
const userThree = {
    _id: userThreeID,
    name: 'user3',
    username: 'user3login',
    email: 'test-email@gmail.com',
    password: 'passtest',
    tokens:[{
        token: jwt.sign({_id: userThreeID}, process.env.JWT_SECRET)
    }]
}

const userFourID = new mongoose.Types.ObjectId();
const userFour = {
    _id: userFourID,
    name: 'user4',
    username: 'user_4_user',
    email: 'test_email_number4@gmail.com',
    password: 'passtest',
    tokens:[{
        token: jwt.sign({_id: userFourID}, process.env.JWT_SECRET)
    }]
}


const userFiveID = new mongoose.Types.ObjectId();
const userFive = {
    _id: userFiveID,
    name: 'user5',
    username: 'user-5-',
    email: 'user5-5-5-@gmail.com',
    password: 'passtest',
    tokens:[{
        token: jwt.sign({_id: userFiveID}, process.env.JWT_SECRET)
    }]
}

const userSixID = new mongoose.Types.ObjectId();
const userSix = {
    _id: userSixID,
    name: 'user6',
    username: 'user!6!',
    email: 'user!-6-!@gmail.com.vn',
    password: 'passtest',
    tokens:[{
        token: jwt.sign({_id: userSixID}, process.env.JWT_SECRET)
    }]
}

const userSevenID = new mongoose.Types.ObjectId();
const userSeven = {
    _id: userSevenID,
    name: 'user7',
    username: '7__u__7',
    email: '7__u__7@gmail.com',
    password: 'passtest',
    tokens:[{
        token: jwt.sign({_id: userSevenID}, process.env.JWT_SECRET)
    }]
}

const userEightID = new mongoose.Types.ObjectId();
const userEight = {
    _id: userEightID,
    name: 'user8',
    username: 'user@8',
    email: '!!!!!----!!!!!@gmail.com',
    password: 'passtest',
    tokens:[{
        token: jwt.sign({_id: userEightID}, process.env.JWT_SECRET)
    }]
}


const setupDatabase = async () =>{
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new User(userThree).save();
    await new User(userFour).save();
    await new User(userFive).save();
    await new User(userSix).save();
    await new User(userSeven).save();
    await new User(userEight).save();
}

const clearDatabase = async () => {
    await User.deleteMany();
}

module.exports = {
    userOneID,
    userOne,
    userTwoID,
    userTwo,
    userThreeID,
    userThree,
    userFourID,
    userFour,
    userFiveID,
    userFive,
    userSixID,
    userSix,
    userSevenID,
    userSeven,
    userEightID,
    userEight,
    setupDatabase,
    clearDatabase
}