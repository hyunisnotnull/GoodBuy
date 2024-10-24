const DB = require('../db/db.js');

const chatService = {

    // 로그인한 사용자가 참여한 채팅방 목록을 가져오는 함수
    getChatRooms: (req, res) => {
        const userId = req.user.M_ID;
        const query = `
            SELECT DISTINCT CH_NO, CH_OWNER_ID, CH_OWNER_NICK, CH_OTHER_ID, CH_OTHER_NICK 
            FROM TBL_CHAT
            WHERE CH_OWNER_ID = ? OR CH_OTHER_ID = ?
        `;
        DB.query(query, [userId, userId], (err, results) => {
            if (err) throw err;
            res.render('chat/chatRooms', { rooms: results });
        });
    },

    // 채팅 메시지 저장
    saveChatMessage: (senderId, senderNick, receiverId, receiverNick, message, roomId) => {
        const query = `
            INSERT INTO TBL_CHAT (CH_OWNER_ID, CH_OWNER_NICK, CH_OTHER_ID, CH_OTHER_NICK, CH_BODY, CH_ACTIVE) 
            VALUES (?, ?, ?, ?, ?, 2)
        `;
        const params = [senderId, senderNick, receiverId, receiverNick, message];
        DB.query(query, params, (err, results) => {
            if (err) throw err;
            console.log('Message saved to DB');
        });
    },

    // 특정 채팅방의 메시지 가져오기
    getChatRoom: (req, res, roomId) => {
        const query = 'SELECT * FROM TBL_CHAT WHERE CH_NO = ?';
        DB.query(query, [roomId], (err, results) => {
            if (err) throw err;
            res.render('chat/chatting', { chats: results, roomId });
        });
    }
};

module.exports = chatService;
