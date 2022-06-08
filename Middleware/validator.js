const Joi = require('joi')

//schema to validate contact
const authContactSchema = Joi.object({
    firstName: Joi.string().required(),
    contactNum: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
    email: Joi.string().required().lowercase().email(),
    address: Joi.string().max(100).required(),
})

//schema to validate user
const authUserSchema = Joi.object({
    email: Joi.string().required().lowercase().email(),
    password: Joi.string().min(8),
})

module.exports = {
    authContactSchema,
    authUserSchema
}