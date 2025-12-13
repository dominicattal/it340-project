const express = require('express')
const router = express.Router()
const Login = require('../models/loginModel')

function validateUsername(username) {
    return true;
}

router.get('/test', async (req, res) => {
    res.status(200).json({message: "hello world"})
})


router.post('/register', async (req, res) => {    
    try {
        const username = req.body["username"]
        const password = req.body["password"]
        const existingUser = await Login.findOne({username})
        if (existingUser) {
            // user already exists
            res.status(200).json({
                "created": false,
                "message": "user already exists"
            })
            return
        }
        const user = await Login.create({username, password})
        res.status(200).json({
            "created": true,
            "message": "successfully created user"
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
})

router.post('/login', async (req, res) => {
    try {
        const username = req.body["username"]
        const password = req.body["password"]
        const user = await Login.findOne({ username })
        if (!user) {
            res.status(200).json({
                "found": false,
                "message": "user not found"
            })
            return 
        }
        if (user["password"] != password) {
            res.status(200).json({
                "found": false,
                "message": "incorrect password"
            })
            return
        }
        res.status(200).json({
            "found": true,
            "message": "success",
            "username": username,
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
})

module.exports = router 