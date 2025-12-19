const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');
const Login = require('../models/loginModel')
const Gundam = require('../models/gundamModel.js')

router.get('/test', async (req, res) => {
    res.status(200).json({message: "hello world"})
})


router.post('/register', async (req, res) => {    
    try {
        const username = req.body["username"]
        const email = req.body["email"]
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
        const user = await Login.create({username, email, password})
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
            "email": user["email"]
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
})

router.post("/profile", async (req, res) => {
    try {
        const username = req.body["username"];
        const user = await Login.findOne({username})
        if (!user) {
            res.status(200).json({
                "found": false,
                "message": "user not found"
            })
            return 
        }
        res.status(200).json({
            "found": true,
            "message": "success",
            "username": username,
            "email": user["email"],
            "mobile": user["mobile"],
            "phone": user["phone"],
            "address": user["address"]
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
})

otps = {}

router.post('/otpgen', async (req, res) => {
    console.log(req.body)
    try {
        const user = req.body["user"];
        const email = req.body["email"];
        const otp = Math.floor(Math.random() * 900000) + 100000;
        // uncomment for demo, dont waste mailtrap emails
        /* const transporter = nodemailer.createTransport({
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
        }) */
        otps[user] = otp;
        console.log(otp)
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
            delete otps[user];
            res.status(200).json({"result": "success"});
        } else {
            res.status(200).json({"result": "fail3"});
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
})

router.post('/models', async (req, res) => {
    try {
        const username = req.body["username"];
        const grade = req.body["grade"];
        const from = req.body["from"];
        const to = req.body["to"];

        // Load combined data from JSON file
        const fs = require('fs');
        const path = require('path');
        const combinedDataPath = path.join(__dirname, '../data/combined_price_data.json');

        if (!fs.existsSync(combinedDataPath)) {
            return res.status(404).json({error: "Combined data file not found"});
        }

        const combinedData = JSON.parse(fs.readFileSync(combinedDataPath, 'utf8'));
        const models = combinedData.models.filter(model => model.grade === grade);
        const user = await Login.findOne({"username": username});
        if (user) {
            for (let i = 0; i < models.length; i++) {
                const model = models[i];
                for (let j = 0; j < model.stores.length; j++) {
                    const idx = user.bookmarks.indexOf(model.stores[j].url);
                    model.stores[j]["bookmarked"] = idx >= 0
                }
            }
        }
        

        // Apply pagination
        const paginatedModels = models.slice(from, to);

        res.status(200).json(paginatedModels)
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
})

router.post('/bookmarkadd', async(req, res) => {
    try {
        const user = await Login.findOne({"username":req.body["username"]})
        user.bookmarks.push(req.body["url"])
        user.save()
        res.status(200).json({"message": "success"})
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
})

router.post('/bookmarkremove', async (req, res) => {
    try {
        const user = await Login.findOne({"username":req.body["username"]})
        const idx = user.bookmarks.indexOf(req.body["url"])
        user.bookmarks.splice(idx, 1)
        user.save()
        res.status(200).json({"message": "success"})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({error: error.message});
    }
})

router.post('/bookmarktoggle', async (req, res) => {
    try {
        const user = await Login.findOne({"username":req.body["username"]})
        const url = req.body["url"];
        const idx = user.bookmarks.indexOf(req.body["url"])
        if (idx >= 0)
            user.bookmarks.splice(idx, 1)
        else
            user.bookmarks.push(url)
        user.save()
        res.status(200).json({"message": "success"})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({error: error.message});
    }
})

router.post('/bookmarkremoveall', async (req, res) => {
    try {
        const user = await Login.findOne({"username":req.body["username"]})
        user.bookmarks = []
        user.save()
        res.status(200).json({"message": "success"})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({error: error.message});
    }
})

router.post('/bookmarks', async (req, res) => {
    try {
        const user = await Login.findOne({"username": req.body["username"]})
        let models = []
        const all = await Gundam.find();
        for await (const url of user.bookmarks) {
            const model = await Gundam.findOne({"url": url})
            if (model == null)
                continue;
            models.push({
                "grade": model.grade,
                "name": model.name,
                "img": model.img,
                "price": model.price,
                "url": model.url
            })
        }
        res.status(200).json(models)
    } catch (error) {
        console.log(error.message);
        res.status(400).json({error: error.message});
    }
})

module.exports = router 