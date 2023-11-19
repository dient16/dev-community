let users = [];
let disconnected = [];
let unreadNotification = [];

function addNewSocket(userId, socketId) {
    const user = users.find((item) => item.id === userId);
    if (user && user.socketId === socketId) {
        return users;
    } else {
        if (user && user.socketId !== socketId) {
            removeSocket(userId, socketId);
        }
        const newUser = { id: userId, socketId };
        users.push(newUser);
        disconnected = disconnected.filter((item) => item.id !== newUser.id);
        return users;
    }
}

function removeSocket(userId, socketId) {
    users = users.filter((item) => item.socketId !== socketId);
    const newDisconnected = { id: userId, socketId };
    disconnected.push(newDisconnected);
}

function findConnectedUser(userId) {
    return users.find((item) => item.id === userId);
}

function socketHandler(io) {
    io.use((socket, next) => {
        const { query } = socket.handshake;
        const { userId } = query;
        socket.data.userId = userId;

        next();
    });
    return io.on('connection', (socket) => {
        const reconnectedUser = disconnected.findIndex((item) => item.id === socket.data.userId);
        socket.on('join', ({ userId, socketId }) => {
            if (reconnectedUser !== -1) {
                unreadNotification.forEach((notification) => {
                    if (notification.id === disconnected[reconnectedUser].id) {
                        io.to(socketId).emit('notification', notification.data);
                    }
                });
            }
            const userSockets = addNewSocket(userId, socketId);
            console.log(`connected: `, userSockets);
            console.log('disconnected: ', disconnected);
        });

        socket.on('clearNotification', ({ sender }) => {
            unreadNotification = unreadNotification.filter((item) => item?.id !== sender?.id);
        });

        socket.on('like', ({ sender, receiver, postId, date }) => {
            const receiverSocket = findConnectedUser(receiver.id);
            if (receiverSocket) {
                io.to(receiverSocket.socketId).emit('notification', {
                    sender: sender,
                    receiver: receiver,
                    type: 'like',
                    postId: postId,
                    date: date,
                });
                unreadNotification.push({
                    id: receiver.id,
                    data: {
                        sender: sender,
                        receiver: receiver,
                        type: 'like',
                        postId: postId,
                        date: date,
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
        });

        socket.on('follow', ({ sender, receiver, date }) => {
            const receiverSocket = findConnectedUser(receiver.id);
            console.log(sender);
            if (receiverSocket) {
                io.to(receiverSocket.socketId).emit('notification', {
                    sender: sender,
                    receiver: receiver,
                    date,
                    type: 'follow',
                });
                unreadNotification.push({
                    id: receiver.id,
                    data: {
                        sender: sender,
                        receive: receiver,
                        date,
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
        });

        socket.on('comment', ({ sender, receiver }) => {
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
        });

        socket.on('disconnect', () => {
            const disconnectingUser = users.find((item) => item.socketId === socket.id);
            removeSocket(disconnectingUser.id, socket.id);
            console.log(`connected: `, users);
            console.log('disconnected: ', disconnected);
        });
    });
}

module.exports = { socketHandler };
