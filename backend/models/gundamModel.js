const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gundamSchema = new Schema({
    grade: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Gundam', gundamSchema)