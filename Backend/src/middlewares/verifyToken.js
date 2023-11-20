const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
    // headers: { authorization: Bearer token}
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid access token',
                });
            }
            req.user = decode;
            next();
        });
    } else {
        return res.status(401).json({
            status: 'error',
            message: 'Require authentication!!!',
        });
    }
};

const allowNullAccessToken = (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, decode) => {
            req.user = decode;
            next();
        });
    } else next();
};

module.exports = {
    verifyAccessToken,
    allowNullAccessToken,
};
