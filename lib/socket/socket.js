const chatService = require('../service/chatService');

const initSocket = (server) => {
    const io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // 클라이언트가 특정 채팅방(CH_NO)에 참여하는 이벤트 처리
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId); // CH_NO를 기반으로 방에 참여
            console.log(`User ${socket.id} joined room: ${roomId}`);
        });

        // 클라이언트가 보낸 메시지 처리
        socket.on('chatMessage', ({ roomId, senderId, senderNick, receiverId, receiverNick, message }) => {
            // DB에 메시지 저장
            chatService.saveChatMessage(senderId, senderNick, receiverId, receiverNick, message, roomId);
            
            // 같은 채팅방(CH_NO)에 있는 클라이언트에게 메시지 전달
            io.to(roomId).emit('message', {
                senderId,
                senderNick,
                message
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

module.exports = initSocket;
