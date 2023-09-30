let unreadNotification = [];

function findConnectedUser(userId) {
    return users.find((item) => item.id === userId);
}

function handleLike(sender, receiver, postId, io) {
    const receiverSocket = findConnectedUser(receiver.id);
    if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('notification', {
            senderName: sender.username,
            receiverName: receiver.username,
            type: 'like',
            postId: postId,
        });
        unreadNotification.push({
            id: receiver.id,
            data: {
                senderName: sender.username,
                receiverName: receiver.username,
                type: 'like',
                postId: postId,
            },
        });
    } else {
        const disconnectedIndex = disconnected.findIndex((item) => item.id === receiver.id);
        if (disconnectedIndex !== -1) {
            unreadNotification.push({
                id: disconnected[disconnectedIndex].id,
                data: {
                    senderName: sender.username,
                    receiverName: receiver.username,
                    type: 'like',
                    postId: postId,
                },
            });
        }
    }
}

function handleFollow(sender, receiver, io) {
    const receiverSocket = findConnectedUser(receiver.id);
    if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('notification', {
            senderName: sender.username,
            receiverName: receiver.username,
            type: 'follow',
        });
        unreadNotification.push({
            id: receiver.id,
            data: {
                senderName: sender.username,
                receiverName: receiver.username,
                type: 'follow',
            },
        });
    } else {
        const disconnectedIndex = disconnected.findIndex((item) => item.id === receiver.id);
        if (disconnectedIndex !== -1) {
            unreadNotification.push({
                id: disconnected[disconnectedIndex].id,
                data: {
                    senderName: sender.username,
                    receiverName: receiver.username,
                    type: 'follow',
                },
            });
        }
    }
}

function handleComment(sender, receiver, io) {
    const receiverSocket = findConnectedUser(receiver.id);
    if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('notification', {
            senderName: sender.username,
            receiverName: receiver.username,
            type: 'comment',
        });
        unreadNotification.push({
            id: receiver.id,
            data: {
                senderName: sender.username,
                receiverName: receiver.username,
                type: 'comment',
            },
        });
    } else {
        const disconnectedIndex = disconnected.findIndex((item) => item.id === receiver.id);
        if (disconnectedIndex !== -1) {
            unreadNotification.push({
                id: disconnected[disconnectedIndex].id,
                data: {
                    senderName: sender.username,
                    receiverName: receiver.username,
                    type: 'comment',
                },
            });
        }
    }
}

module.exports = {
    handleLike,
    handleFollow,
    handleComment,
    unreadNotification,
};
