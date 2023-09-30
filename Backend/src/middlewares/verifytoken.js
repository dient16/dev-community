const jwt = require('jsonwebtoken');

const verifyToken = {
    verifyAccessToken: (req, res, next) => {
        // Bearer token
        // headers: { authorization: Bearer token}
        if (req?.headers?.authorization?.startsWith('Bearer')) {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, decode) => {
                if (err) {
                    return res.status(401).json({
                        result: 'fail',
                        message: 'Invalid access token',
                    });
                }
                req.user = decode;
                next();
            });
        } else {
            return res.status(401).json({
                result: 'fail',
                message: 'Require authentication!!!',
            });
        }
    },

    verifyIsAdmin: (req, res, next) => {
        const { isAdmin } = req.user;
        if (isAdmin) {
            return res.status(401).json({
                result: 'fail',
                message: 'REQUIRE ADMIN ROLE',
            });
        }
        next();
    },
};
module.exports = verifyToken;
