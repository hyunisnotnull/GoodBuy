const express = require('express');
const router = express.Router();
const chatService = require('../lib/service/chatService');

// 채팅방 목록 조회 (현재 사용자가 속한 모든 방)
router.get('/list', (req, res) => {
    console.log('/chat/list');
    chatService.getChatRooms(req, res);
});

// 특정 채팅방(CH_NO)에 참여
router.get('/room/:roomId', (req, res) => {
    const roomId = req.params.rooms.CH_NO;
    chatService.getChatRoom(req, res, roomId);
});

module.exports = router;
