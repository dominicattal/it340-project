const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');
dotenv.config()
const app = express();
const mongoose = require('mongoose')
const routes = require('./routes/routes.js')

app.use(cors());
app.use(express.json())

app.use((req, res, next)=> {
    console.log(req.path, req.method)
    next()
})

app.use('/api', routes)
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{

        app.listen(process.env.PORT, '0.0.0.0', () => {
            console.log(`Listening on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })
