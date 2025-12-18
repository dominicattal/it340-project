const mongoose = require('mongoose')
const Schema = mongoose.Schema

const loginSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String
    },
    bookmarks: {
        type: Array
    }
})

module.exports = mongoose.model('Login', loginSchema)