const validateRequest = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};

module.exports = {
    validateRequest,
};
