const Joi = require('joi');

const asyncHandler = require('express-async-handler');

//Joi for input data validation
const tpssInputSchema = Joi.object({
    ID: Joi.number()
        .required(),
    Amount: Joi.number()
        .required(),
    Currency: Joi.string()
        .required(),
    CustomerEmail: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'io'] } })
        .required(),
    SplitInfo: Joi.array().items(Joi.object({
        SplitType: Joi.string()
            .required(),
        SplitValue: Joi.number()
            .required(),
        SplitEntityId: Joi.string()
            .required()
    })).min(1).max(20)
})


const validateInput = asyncHandler( async function(req, res, next){
    // Get value and validate
    try {
        const {
            ID,
            Amount,
            Currency,
            CustomerEmail,
            SplitInfo
        } = req.body
        const value = await tpssInputSchema.validateAsync({ID, Amount, Currency, CustomerEmail, SplitInfo});
        if(value){
            next();
        }
    } catch (error) {
        const {message} = error.details[0];
        next(new Error(message));
       
    }
     
})

module.exports = validateInput;
