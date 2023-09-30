const jwt = require('jsonwebtoken');

const jwtMiddleware = {
    generateAccessToken: (uid, isAdmin) => {
        return jwt.sign(
            {
                _id: uid,
                isAdmin,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: '7d' },
        );
    },

    generateRefreshToken: (uid) => {
        return jwt.sign(
            {
                _id: uid,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: '365d' },
        );
    },
};
module.exports = jwtMiddleware;
