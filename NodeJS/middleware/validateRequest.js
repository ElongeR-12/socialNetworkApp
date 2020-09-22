exports.validateRequest = (req, res, next, schema) =>{
    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        // on fail return comma separated errors
        return res.status(400).json({
            error: `Validation error: ${error.details.map(x => x.message).join(', ')}`
        })
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}