const express = require('express')
const router = express.Router()
const Login = require('../models/loginModel')
const hash = require('object-hash')

function validateUsername(username) {
    return true;
}

router.post('/register', async (req, res) => {
    const username = req.body["username"]
    const password = req.body["password"]
    if (!username) {
        res.status(400).json({"message": "no username"})
    }
    if (!password) {
        res.status(400).json({"message": "no password"})
    }
    try {
        let hashed = hash({password})
        const user = await Login.create({username, password:hashed})
        res.status(200).json({
            "message": "successfully created user"
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
})

module.exports = router 