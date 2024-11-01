const DB = require('../db/db.js');

const chatModel = {

    checkChatRoomExist: (post, callback) => {

        const sql = `SELECT * FROM TBL_CHAT
                    WHERE (CH_SENDER_ID = ? AND CH_RECEIVER_ID = ? AND CH_PRODUCT_NO = ?)
                    UNION
                    SELECT * FROM TBL_CHAT
                    WHERE (CH_SENDER_ID = ? AND CH_RECEIVER_ID = ? AND CH_PRODUCT_NO = ?)`;
        const state = [post.my_id, post.u_id, post.p_no, post.u_id, post.my_id, post.p_no];

        DB.query(sql, state, callback);

    },

    findUserById: (oId, callback) => {

        const sql = `SELECT * FROM TBL_USER WHERE U_ID = ?`;
        
        DB.query(sql, [oId], callback);

    },

    createChatRoom: (post, callback) => {

        const sql = `INSERT INTO TBL_CHAT (CH_SENDER_ID, CH_SENDER_NICK, CH_RECEIVER_ID, CH_RECEIVER_NICK, CH_PRODUCT_NO)
                    VALUES (?, ?, ?, ?, ?)`;
        const state = [post.my_id, post.my_nick, post.u_id, post.u_nick, post.p_no];

        DB.query(sql, state, callback);

    },

    findChatRooms: (U_ID, callback) => {

        const sql = `SELECT * FROM TBL_CHAT WHERE CH_SENDER_ID = ? OR CH_RECEIVER_ID = ?`;
        
        DB.query(sql, [U_ID, U_ID], callback);

    },

    findChatRoomId: (roomId, callback) => {

        const sql = `SELECT * FROM TBL_CHAT WHERE CH_NO = ?`;
        
        DB.query(sql, [roomId], callback);

    },

    findChatMessage: (roomId, senderId, senderNick, otherId, otherNick, callback) => {
        
        const sql = `SELECT 
                        M.M_SENDER_ID AS senderId,
                        M.M_SENDER_NICK AS senderNick,
                        M.M_RECEIVER_ID AS otherId,
                        M.M_RECEIVER_NICK AS otherNick,
                        M.M_CONTENT AS message,
                        M.M_TIME AS time
                    FROM TBL_MESSAGE M
                    WHERE M.M_CHAT_CH_NO = ?
                    ORDER BY M.M_TIME ASC`;

        DB.query(sql, [roomId], callback);

    },

    saveChattings: (values, callback) => {

        const sql = `INSERT INTO TBL_MESSAGE 
                    (M_CHAT_CH_NO, M_SENDER_ID, M_SENDER_NICK, M_RECEIVER_ID, M_RECEIVER_NICK, M_CONTENT)
                    VALUES (?, ?, ?, ?, ?, ?)`;

        DB.query(sql, values, callback);
        
    },

    resetUnreadCount: (roomId, callback) => {
        const sql = `UPDATE TBL_CHAT SET CH_UNREAD_COUNT = 0 WHERE CH_NO = ?`;
        DB.query(sql, [roomId], callback);
    },

}

module.exports = chatModel;