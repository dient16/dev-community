const to = require('await-to-js').default;
const Notification = require('../models/notification.model');

const saveNotification = async (senderId, receiverId, postId, commentId, type) => {
    const notification = new Notification({
        sender: senderId,
        receiver: receiverId,
        post: postId,
        comment: commentId,
        type: type,
    });

    const [error, savedNotification] = await to(notification.save());

    if (error) {
        throw error;
    }

    return savedNotification;
};

const getNotifications = async (userId) => {
    const [error, notifications] = await to(
        Notification.find({ receiver: userId })
            .populate('sender', 'username avatar')
            .populate('post', 'title')
            .populate('comment', 'content'),
    );

    if (error) {
        throw error;
    }

    return notifications;
};

const clearNotifications = async (userId) => {
    const [error] = await to(Notification.deleteMany({ receiver: userId }));

    if (error) {
        throw error;
    }
};

module.exports = {
    saveNotification,
    getNotifications,
    clearNotifications,
};
