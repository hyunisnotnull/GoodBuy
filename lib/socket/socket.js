const chatService = require('../service/chatService');
const socketIO = require('socket.io');

const initSocket = (server) => {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('사용자가 연결되었습니다:', socket.id);

        // 클라이언트가 특정 채팅방에 참여하는 이벤트 처리
        socket.on('joinRoom', async (roomId) => {
            console.log(`사용자가 방에 참여하려고 합니다. 전달된 roomId: ${roomId}`);
        
            if (!roomId) {
                console.error('roomId가 null입니다. 방에 참여할 수 없습니다.');
                return;
            }

            // 사용자가 특정 채팅방에 참여
            socket.join(roomId);
            console.log(`사용자 ${socket.id}가 방에 참여했습니다: ${roomId}`);
        
            // 이전 채팅 메시지 불러오기
            try {
                const previousMessages = await chatService.getChatHistory(roomId);
                socket.emit('previousMessages', previousMessages);  // 이전 메시지를 클라이언트로 전송
            } catch (error) {
                console.error('이전 메시지를 불러오는 중 오류 발생:', error);
            }
        });
        
        // 클라이언트가 보낸 메시지 처리
        socket.on('chatMessage', (data) => {
            const { roomId, CH_BODY, CH_OWNER_ID, CH_OWNER_NICK, profileImg, time } = data;

            // roomId 값이 제대로 전달되고 있는지 확인
            console.log('전달된 roomId:', roomId);

            if (!roomId) {
                console.error('roomId가 null입니다. 메시지를 저장할 수 없습니다.');
                return;
            }

            // DB에 메시지 저장
            chatService.saveChatMessage(CH_OWNER_ID, CH_BODY, roomId);

            // 같은 채팅방(roomId)에 있는 모든 클라이언트에게 메시지 전달
            io.to(roomId).emit('chatMessage', {
                CH_BODY,
                CH_OWNER_ID,
                CH_OWNER_NICK,
                profileImg,
                time
            });
        });

        // 사용자가 연결 해제될 때 처리
        socket.on('disconnect', () => {
            console.log('사용자가 연결 해제되었습니다:', socket.id);
        });
    });
};

module.exports = initSocket;
