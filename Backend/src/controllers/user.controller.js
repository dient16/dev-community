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

    try {
        const user = await User.findById(uid).select('-refreshToken -password');

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
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Error getting user',
        });
    }
};

const getUserByUsername = async (req, res, next) => {
    const { username } = req.params;
    if (!username) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing input',
        });
    }
    try {
        const user = await User.findOne({ username: username })
            .select('-refreshToken -password')
            .populate({
                path: 'posts',
                select: 'title tags createdAt',
                populate: {
                    path: 'tags',
                    select: 'name theme',
                },
            });
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
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Error getting user',
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

const followUser = async (req, res, next) => {
    try {
        const { uid: userIdToFollow } = req.params;
        const { _id: followerId } = req.user;

        const [updateError, updatedUserToFollow] = await to(
            User.findByIdAndUpdate(
                userIdToFollow,
                {
                    $addToSet: { followers: followerId },
                },
                { new: true },
            ).select('firstname lastname avatar followers following'),
        );

        const [followerUpdateError, updatedFollower] = await to(
            User.findByIdAndUpdate(
                followerId,
                {
                    $addToSet: { following: userIdToFollow },
                },
                { new: true },
            ).select('firstname lastname avatar followers following'),
        );

        if (updateError || followerUpdateError) {
            return res.status(500).json({
                status: 'error',
                message: 'Could not follow user',
            });
        }

        if (!updatedUserToFollow) {
            return res.status(404).json({
                status: 'error',
                message: 'User to follow not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            userToFollow: updatedUserToFollow,
            follower: updatedFollower,
        });
    } catch (error) {
        next(error);
    }
};

const unfollowUser = async (req, res, next) => {
    try {
        const { uid: userIdToUnfollow } = req.params;
        const { _id: followerId } = req.user;

        const [updateError, updatedUserToUnfollow] = await to(
            User.findByIdAndUpdate(
                userIdToUnfollow,
                {
                    $pull: { followers: followerId },
                },
                { new: true },
            ).select('firstname lastname avatar followers following'),
        );

        const [followerUpdateError, updatedFollower] = await to(
            User.findByIdAndUpdate(
                followerId,
                {
                    $pull: { following: userIdToUnfollow },
                },
                { new: true },
            ).select('firstname lastname avatar followers following'),
        );

        if (updateError || followerUpdateError) {
            return res.status(500).json({
                status: 'error',
                message: 'Could not unfollow user',
            });
        }

        if (!updatedUserToUnfollow) {
            return res.status(404).json({
                status: 'error',
                message: 'User to unfollow not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            userToUnfollow: updatedUserToUnfollow,
            follower: updatedFollower,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCurrentUser,
    editUser,
    getUserByUsername,
    followUser,
    unfollowUser,
};
