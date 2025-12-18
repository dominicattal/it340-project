const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');
dotenv.config()
const app = express();
const mongoose = require('mongoose')
const routes = require('./routes/routes.js')
const data = require('./data/data.json')
const Gundam = require('./models/gundamModel.js')

app.use(cors());
app.use(express.json())

app.use((req, res, next)=> {
    console.log(req.path, req.method)
    next()
})

async function updateDB() {
    return
    models = data["models"];
    for (let i = 0; i < models.length-1; i++) {
        let model = models[i];
        const existingModel = await Gundam.findOne({"name":model["name"]})
        if (existingModel) {
            continue;
        }
        const user = await Gundam.create({
            "grade": model["grade"],
            "name": model["name"],
            "img": model["img"],
            "price": model["price"],
        })
    }
}

app.use('/api', routes)
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        updateDB().then(()=>{
            app.listen(process.env.PORT, '0.0.0.0', () => {
            console.log(`Listening on port ${process.env.PORT}`)
            })
        });
    })
    .catch((error) => {
        console.log(error)
    })
