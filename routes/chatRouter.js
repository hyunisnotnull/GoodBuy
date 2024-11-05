const express = require('express');
const router = express.Router();
const chatService = require('../lib/service/chatService');

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


module.exports = router;
