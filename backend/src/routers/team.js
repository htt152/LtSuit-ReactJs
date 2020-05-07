const express = require('express')
const Team = require('../models/team')
const router = new express.Router()
const User = require('../models/user')

const addUserToTeam = async(req,res) =>{
    let i = 0;
    const teamID = req.teamID;
    const teamName = req.teamName;
    const teamMembers = req.teamMembers
    console.log(req.teamMembers)
    while (!teamMembers[i]){
        let user = await User.findOne({email: teamMembers[i].userEmail})
        if (!user){
            return res.status(400).send((new Error("User name " + teamMembers[i].userName + " not found")))
        }
        else{
            if (user.name!=teamMembers[i].userName){
                return res.status(400).send(("User name " + teamMembers[i].userName + " not found"))
            }
            for (var j = 0; j < user.teams.length;j++){
                if (user.teams[j].teamName == teamName){
                    return res.status(400).send(("User name " + teamMembers[i].userName + " is already in this team"))
                }
            }
            user.teams.push({
                    teamID:teamID,
                    teamName:teamName
            })
            user.save()
        }
        i++
    }
}

router.post('/teams/adduser', async (req,res) => {
    try {
        const user = await User.findOne({email: req.body.userEmail})
        if(!user){
            res.status(400).send({error: 'Email not found!'})
        }
        const team = await Team.findOne({teamName: req.body.teamName})
        if(!team){
            res.status(400).send({error: 'Team not found!'})
        }
        const users = await User.findOne({'teams.teamName': req.body.teamName, email: req.body.userEmail})
        if(!users){
            user.teams = user.teams.concat({teamID: team._id,teamName: req.body.teamName})
            await user.save()
            team.teamMembers = team.teamMembers.concat({userEmail: req.body.userEmail, userName: req.body.userName})
            await team.save()
            res.status(201).send()
        }else{
            res.status(400).send({error: 'Email da co trong Team: ' + req.body.teamName})
        }
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/teams/create',async (req,res) => {
    try {
        const team = new Team(req.body)
        const exitingTeam = await Team.findOne({teamName: req.body.teamName})
        if (exitingTeam){
            return res.status(400).send("Team da ton tai")
        }
        await team.save()
        return res.status(201).send({team})
    } catch (e) {
        return res.status(400).send()
    }
})

router.get('/search/:searchString', async(req,res)=>{
    try {
        let returnObject = {
            userArray:[],
            teamArray:[]
        };
        let userValue = await User.find({"username" : new RegExp(req.params.searchString,"i")},{username:1,email:1,_id:0})
        for (var i = 0; i < userValue.length;i++){
            returnObject.userArray.push({
                userName: userValue[i].username,
                userEmail: userValue[i].email
            })
        }
        let teamValue = await Team.find({"teamName" : new RegExp(req.params.searchString,"i")},{teamName:1,_id:1})
        for (var i = 0; i < teamValue.length;i++){
            returnObject.teamArray.push({
                teamName: teamValue[i].teamName,
                teamID: teamValue[i]._id
            })
        }
        return res.status(200).send(returnObject)
    } catch (e) {
        return res.status(400).send(e)
    }
})

module.exports = router
