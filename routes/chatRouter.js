const express = require('express');
const router = express.Router();
const chatService = require('../lib/service/chatService');
const uploads = require('../lib/upload/uploads');
const { getIO } = require('../lib/socket/socket');
const roleCheck = require('../lib/passport/roleCheck');

// 채팅방 생성
router.post('/chat', roleCheck(1), (req, res) => {
    console.log('/chat/chat/');
    chatService.createRoom(req, res);
});

// 채팅방 목록
router.get('/chatList', (req, res) => {
    console.log('/chat/chatList/');
    chatService.chatList(req, res);
});

// 목록에서 채팅방 입장
router.get('/chat/:roomId', roleCheck(1), (req, res) => {
    const { roomId } = req.params;
    console.log(`/chat/chat/:roomId/ - 요청된 roomId: ${roomId}`);
    chatService.enterChatRoom(req, res);
});

// 채팅방 삭제 경로 등록
router.delete('/delete/:roomId', roleCheck(1), (req, res) => {
    console.log('/chat/delete/:roomId/');
    chatService.deleteChatRoom(req, res);
});

// 사진 업로드
router.post('/uploadImage/:roomId', uploads.UPLOAD_CHAT_IMAGE_MIDDLEWARE(), (req, res) => {
    console.log('파일 업로드 라우트 호출됨');
    
    const { roomId } = req.params;
    const { senderId, senderNick, receiverId, receiverNick } = req.body;

    if (req.file) {
        const imagePath = `/uploads/chat_images/${roomId}/${req.file.filename}`;

        // TBL_MESSAGE와 TBL_CHAT_IMAGE에 메시지와 이미지 경로 저장
        chatService.saveMessageWithImage(roomId, senderId, senderNick, receiverId, receiverNick, imagePath, (err, messageId) => {
            if (err) {
                console.error('메시지 및 이미지 저장 중 오류 발생:', err);
                return res.status(500).json({ error: '메시지 및 이미지 저장에 실패했습니다.' });
            }

            // 성공적으로 이미지 메시지와 경로 저장
            res.json({ success: true, imageUrl: imagePath });

            // Socket.IO를 통해 채팅방 사용자들에게 이미지 메시지 전송
            const io = getIO();
            io.to(roomId).emit('message', {
                roomId,
                senderId,
                senderNick,
                otherId: receiverId,
                otherNick: receiverNick,
                message: `<img src="${imagePath}" class="chat-image">`,
                time: new Date(),
            });
        });
    } else {
        res.status(400).json({ error: '파일 업로드 실패' });
    }
});

// 관리자와 채팅 생성
router.get('/adminContact', (req, res) => {
    console.log('/관리자와 채팅 생성/');
    chatService.createAdminChat(req, res);
});

// 관리자 채팅방 입장
router.get('/chatA/:roomId', (req, res) => {
    const { roomId } = req.params;
    console.log(`관리자/chat/chatA/:roomId/ - 요청된 roomId: ${roomId}`);
    chatService.enterAdminChatRoom(req, res);
});

module.exports = router;