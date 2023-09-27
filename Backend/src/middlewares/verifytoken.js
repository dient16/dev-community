const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
    // Bearer token
    // headers: { authorization: Bearer token}
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid access token',
                });
            }
            req.user = decode;
            next();
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Require authentication!!!',
        });
    }
};

const isAdmin = (req, res, next) => {
    const { role } = req.user;
    if (role !== 'admin') {
        return res.status(401).json({
            success: false,
            message: 'REQUIRE ADMIN ROLE',
        });
    }
    next();
};

module.exports = {
    verifyAccessToken,
    isAdmin,
};
