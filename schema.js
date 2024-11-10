// joi is schema validtor package


const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({

        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        image : Joi.string().required().allow("",null),
        price : Joi.number().required().min(0),

    }).required()
})
