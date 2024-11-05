const express = require('express');
const router = express.Router();
const chatService = require('../lib/service/chatService');
const uploads = require('../lib/upload/uploads');

// 채팅방 생성
router.post('/chat', (req, res) => {
    console.log('/chat/chat/');
    chatService.createRoom(req, res);

});

// 채팅방 목록
router.get('/chatList', (req, res) => {
    console.log('/chat/chatList/');
    chatService.chatList(req, res);

});

// 목록에서 채팅방 입장
router.get('/chat/:roomId', (req, res) => {
    console.log('/chat/chat/:roomId/');
    chatService.enterChatRoom(req, res);
});

// 채팅방 삭제 경로 등록
router.delete('/delete/:roomId', (req, res) => {
    console.log('/chat/delete/:roomId');
    chatService.deleteChatRoom(req, res);
});

// 사진 업로드 라우트
router.post('/uploadImage/:roomId', uploads.UPLOAD_CHAT_IMAGE_MIDDLEWARE(), (req, res) => {
    console.log('파일 업로드 라우트 호출됨');
    console.log('req.params:', req.params);
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);

    const roomId = req.params.roomId;
    const senderId = req.body.senderId;
    const senderNick = req.body.senderNick;
    const receiverId = req.body.receiverId;
    const receiverNick = req.body.receiverNick;

    if (req.file) {
        const imagePath = `chat_images/${roomId}/${req.file.filename}`;
        
        // TBL_MESSAGE에 새로운 메시지 추가
        chatService.createImageMessage(roomId, senderId, senderNick, receiverId, receiverNick, (err, messageId) => {
            if (err) {
                console.error('메시지 저장 오류:', err);
                return res.status(500).json({ error: '메시지 저장에 실패했습니다.' });
            }
            
            // TBL_CHAT_IMAGE에 이미지 경로 저장
            chatService.saveChatImage(messageId, imagePath, (err) => {
                if (err) {
                    console.error('이미지 경로 저장 오류:', err);
                    return res.status(500).json({ error: '이미지 경로 저장에 실패했습니다.' });
                }
                
                // 성공적으로 이미지 메시지와 경로 저장
                res.json({ success: true, imageUrl: imagePath });
            });
        });
    } else {
        res.status(400).json({ error: '파일 업로드 실패' });
    }
});


module.exports = router;
