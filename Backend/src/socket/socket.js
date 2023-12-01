let users = [];
let disconnected = [];
let unreadNotification = [];

function addNewSocket(userId, socketId) {
    const user = users.find((item) => item?.id === userId);
    if (user && user?.socketId === socketId) {
        return users;
    } else {
        if (user && user?.socketId !== socketId) {
            removeSocket(userId, socketId);
        }
        const newUser = { id: userId, socketId };
        users.push(newUser);
        disconnected = disconnected.filter((item) => item?.id !== newUser?.id);
        return users;
    }
}

function removeSocket(userId, socketId) {
    users = users.filter((item) => item?.socketId !== socketId);
    const newDisconnected = { id: userId, socketId };
    disconnected.push(newDisconnected);
}

function findConnectedUser(userId) {
    return users.find((item) => item?.id === userId);
}

function handleNotification(io, eventType, { sender, receiver, postId, date, data }) {
    const receiverSocket = findConnectedUser(receiver?.id);

    switch (eventType) {
        case 'like':
            handleLikeEvent(io, receiverSocket, sender, receiver, postId, date);
            break;

        case 'follow':
            handleFollowEvent(io, receiverSocket, sender, receiver, date);
            break;

        case 'comment':
            handleCommentEvent(io, receiverSocket, sender, receiver, data, date);
            break;

        default:
            console.error(`Unhandled event type: ${eventType}`);
    }
}

function handleLikeEvent(io, receiverSocket, sender, receiver, postId, date) {
    if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('notification', {
            sender: sender,
            receiver: receiver,
            postId: postId,
            date: date,
            type: 'like',
        });
        unreadNotification.push({
            id: receiver.id,
            data: {
                sender: sender,
                receiver: receiver,
                postId: postId,
                date: date,
                type: 'like',
            },
        });
    } else {
        const disconnectedIndex = disconnected.findIndex((item) => item?.id === receiver?.id);
        if (disconnectedIndex !== -1) {
            unreadNotification.push({
                id: disconnected[disconnectedIndex]?.id,
                data: {
                    sender: sender,
                    receiver: receiver,
                    postId: postId,
                    date: date,
                    type: 'like',
                },
            });
        }
    }
}

function handleFollowEvent(io, receiverSocket, sender, receiver, date) {
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
                receiver: receiver,
                date,
                type: 'follow',
            },
        });
    } else {
        const disconnectedIndex = disconnected.findIndex((item) => item?.id === receiver?.id);
        if (disconnectedIndex !== -1) {
            unreadNotification.push({
                id: disconnected[disconnectedIndex].id,
                data: {
                    sender: sender,
                    receiver: receiver,
                    date,
                    type: 'follow',
                },
            });
        }
    }
}

function handleCommentEvent(io, receiverSocket, sender, receiver, data, date) {
    if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('notification', {
            sender: sender,
            receiver: receiver,
            data,
            date,
            type: 'comment',
        });
        unreadNotification.push({
            id: receiver.id,
            data: {
                sender: sender,
                receiver: receiver,
                data,
                date,
                type: 'comment',
            },
        });
    } else {
        const disconnectedIndex = disconnected.findIndex((item) => item?.id === receiver?.id);
        if (disconnectedIndex !== -1) {
            unreadNotification.push({
                id: disconnected[disconnectedIndex]?.id,
                data: {
                    sender: sender,
                    receiver: receiver,
                    data,
                    date,
                    type: 'comment',
                },
            });
        }
    }
}

function socketHandler(io) {
    io.use((socket, next) => {
        const { query } = socket?.handshake;
        const { userId } = query;
        socket.data.userId = userId;
        next();
    });
    return io.on('connection', (socket) => {
        const reconnectedUser = disconnected.findIndex((item) => item?.id === socket?.data?.userId);
        socket.on('join', ({ userId, socketId }) => {
            if (reconnectedUser !== -1) {
                unreadNotification.forEach((notification) => {
                    if (notification?.id === disconnected[reconnectedUser]?.id) {
                        io.to(socketId).emit('notification', notification?.data);
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
        socket.on('like', (data) => handleNotification(io, 'like', data));
        socket.on('follow', (data) => handleNotification(io, 'follow', data));
        socket.on('comment', (data) => handleNotification(io, 'comment', data));
        socket.on('disconnect', () => {
            const disconnectingUser = users.find((item) => item?.socketId === socket?.id);
            removeSocket(disconnectingUser?.id, socket?.id);
            console.log(`connected: `, users);
            console.log('disconnected: ', disconnected);
        });
    });
}

module.exports = { socketHandler };
