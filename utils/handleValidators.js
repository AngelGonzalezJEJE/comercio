const { validationResult } = require("express-validator");

const validateResults = (req, res, next) => {
    try {
        // Validate the request and throw errors if any validation fails
        validationResult(req).throw();
        return next(); // Proceed to the next middleware/route handler if validation is successful
    } catch (error) {
        res.status(400).send({ errors: error.array() }); // Send a 400 Bad Request with validation errors
    }
};

module.exports = {validateResults};
