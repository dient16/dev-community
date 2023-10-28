const User = require('../models/user.model');
const to = require('await-to-js').default;

const userController = {
    getCurrentUser: async (req, res, next) => {
        const { _id: uid } = req.user;
        if (!uid) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing input',
            });
        }
        const [err, user] = await to(User.findById(uid).select('-refreshToken -password'));
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Error getting user',
            });
        }
        if (user) {
            return res.status(200).json({
                status: 'success',
                userData: user,
            });
        } else {
            return res.status(401).json({
                status: 'error',
                message: 'User not found',
            });
        }
    },
};
module.exports = userController;
