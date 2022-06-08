const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    contactNum: {
        type: Number,
        length: 10,
        required: true,
        unique: true,
    },
    email: {
        type:String,
        required : true,
    },
    address: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
},{
    timestamps: true
})

module.exports = mongoose.model('contact' , contactSchema)