const User = require('../models/user.model');
const to = require('await-to-js').default;

const getCurrentUser = async (req, res, next) => {
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
};

const editUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const update = req.body;
        let avatar;

        if (req.file) {
            avatar = req.file.path;
        }

        if (!uid) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing input',
            });
        }

        const [errEdit, editedUser] = await to(
            User.findByIdAndUpdate(uid, {
                ...update,
                avatar,
            }),
        );

        if (errEdit) {
            return res.status(500).json({
                status: 'error',
                message: 'Error updating user',
                errEdit: errEdit,
            });
        }

        if (editedUser) {
            return res.status(200).json({
                status: 'success',
                userData: editedUser,
            });
        } else {
            return res.status(401).json({
                status: 'error',
                message: 'User not found',
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};

module.exports = {
    getCurrentUser,
    editUser,
};
