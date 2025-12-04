const express = require('express')
const router = express.Router()
const Login = require('../models/loginModel')
const hash = require('object-hash')

function validateUsername(username) {
    return true;
}

router.post('/register', async (req, res) => {    
    try {
        const username = req.body["username"]
        const password = req.body["password"]
        let hashed = hash(password)
        const existingUser = await Login.findOne({username})
        console.log(existingUser)
        if (existingUser)
            throw new Error("user already exists")
        const user = await Login.create({username, password:hashed})
        res.status(200).json({
            "message": "successfully created user"
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
})

router.get('/login', async (req, res) => {
    try {
        const username = req.body["username"]
        const password = req.body["password"]
        let hashed = hash(password)
        const user = await Login.findOne({ username })
        if (!user)
            throw new Error("user does not exist")
        if (user["password"] != hashed)
            throw new Error("Incorrect password")
        res.status(200).json(user)
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
})

module.exports = router 