const Joi = require('joi');
const validateRequest = require('./validateRequest');

exports.authenticateSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .trim(false)
            .min(6)
            .max(30)
            .required(),
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .trim()
            .required(),
        email: Joi.string()
            .trim(false)
            .email({
                minDomainSegments: 2,
                tlds: {
                    allow: ['com', 'net']
                }
            })
            .required(),
        password: Joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
            .required()
    });
    validateRequest.validateRequest(req, res, next, schema);
}
