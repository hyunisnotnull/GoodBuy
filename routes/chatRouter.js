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
    chatService.enterChatRoom(req, res);
});


module.exports = router;
