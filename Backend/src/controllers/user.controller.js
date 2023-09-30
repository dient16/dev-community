const User = require('../models/user.model');

const userController = {
    getCurrentUser: async (req, res, next) => {
        const { _id: uid } = req.user;
        if (!uid) {
            return res.status(400).json({
                status: 'fail',
                message: 'Missing input',
            });
        }
        const user = await User.findById(uid).select('-refreshToken -password');
        if (user) {
            return res.status(200).json({
                status: 'success',
                userData: user,
            });
        } else {
            return res.status(500).json({
                status: 'fail',
                message: 'User not found',
            });
        }
    },
};
module.exports = userController;
