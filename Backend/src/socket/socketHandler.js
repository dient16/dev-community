const { handleLike, handleFollow, handleComment } = require('./handleReceiveNotification');
function socketHandler(io) {
    io.use((socket, next) => {
        const { query } = socket.handshake;
        const { userId } = query;
        socket.data.userId = userId;
        next();
    });
    io.on('connection', (socket) => {
        const reconnectedUser = disconnected.findIndex((item) => item.id === socket.data.userId);

        socket.on('action', ({ actionType, data }) => {
            const { sender, receiver, postId } = data;

            switch (actionType) {
                case 'like':
                    handleLike(sender, receiver, postId, io);
                    break;
                case 'follow':
                    handleFollow(sender, receiver, io);
                    break;
                case 'comment':
                    handleComment(sender, receiver, io);
                    break;
                default:
                    break;
            }
        });
    });
}

module.exports = { socketHandler };
