const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');
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

otps = {}

router.post('/otpgen', async (req, res) => {
    try {
        const email = req.body["email"];
        const user = req.body["user"];
        const otp = Math.floor(Math.random() * 900000) + 100000;
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            },
        })
        await transporter.sendMail({
            from: "laplace@laplace.com",
            to: email,
            subject: 'Your 2FA code',
            text: `${otp}`
        })
        otps[user] = otp;
        console.log(otps)
        res.status(200).json({"message":"success"})
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
})

router.post('/otpverify', async(req, res) => {
    try {
        console.log(otps)
        console.log(req.body)
        const user = req.body["user"];
        const otp_test = req.body["otp"];
        const otp_real = otps[user];
        if (!otp_test) {
            res.status(404).json({"result": "fail1"});
            return;
        }
        if (!otp_real) {
            res.status(404).json({"result": "fail2"});
            return;
        }
        if (otp_test == otp_real) {
            res.status(200).json({"result": "success"});
        } else {
            res.status(200).json({"result": "fail3"});
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
})
module.exports = router 