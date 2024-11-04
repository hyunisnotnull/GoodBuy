const DB = require('../db/db.js');

const chatModel = {

    checkChatRoomExist: (post, callback) => {
        const sql = `
            SELECT * FROM TBL_CHAT
            WHERE (CH_SENDER_ID = ? AND CH_RECEIVER_ID = ? AND CH_PRODUCT_NO = ?)
            UNION
            SELECT * FROM TBL_CHAT
            WHERE (CH_SENDER_ID = ? AND CH_RECEIVER_ID = ? AND CH_PRODUCT_NO = ?)
        `;
        const state = [post.my_id, post.u_id, post.p_no, post.u_id, post.my_id, post.p_no];
    
        DB.query(sql, state, (error, results) => {
            if (error) return callback(error, null);
    
            if (results.length > 0) {
                const room = results[0];
                const roomId = room.CH_NO;
    
                const updateSql = `UPDATE TBL_CHAT SET CH_ACTIVE = 1 WHERE CH_NO = ?`;
                if (room.CH_ACTIVE === 0 || (room.CH_ACTIVE === 2 && post.my_id === room.CH_RECEIVER_ID) 
                    || (room.CH_ACTIVE === 3 && post.my_id === room.CH_SENDER_ID)) {

                    DB.query(updateSql, [roomId], (updateError) => {
                        if (updateError) return callback(updateError, null);
                        room.CH_ACTIVE = 1;
                        callback(null, results);
                    });

                } else {
                    callback(null, results);
                }
            } else {
                callback(null, []);
            }
        });
    }
    ,    

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

        const sql = `SELECT * FROM TBL_CHAT WHERE (CH_SENDER_ID = ? OR CH_RECEIVER_ID = ?) AND CH_ACTIVE != 0`;
        
        DB.query(sql, [U_ID, U_ID], callback);

    },

    findChatinfos: (roomId, callback) => {

        const sql = `SELECT * FROM TBL_CHAT WHERE CH_NO = ?`;
        
        DB.query(sql, [roomId], callback);

    },

    findChatMessage: (roomId, lastExitTime, callback) => {

        const sql = `
            SELECT M.M_SENDER_ID AS senderId,
                   M.M_SENDER_NICK AS senderNick,
                   M.M_RECEIVER_ID AS otherId,
                   M.M_RECEIVER_NICK AS otherNick,
                   M.M_CONTENT AS message,
                   M.M_TIME AS time
            FROM TBL_MESSAGE M
            WHERE M.M_CHAT_CH_NO = ? AND M.M_TIME > ?
            ORDER BY M.M_TIME ASC
        `;
        DB.query(sql, [roomId, lastExitTime], callback);
        
    }
    ,

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

    exitChatRoom: (roomId, userId, callback) => {

        const sql = `
            UPDATE TBL_CHAT
            SET CH_ACTIVE = CASE
                WHEN CH_SENDER_ID = ? AND CH_ACTIVE = 1 THEN 3  -- SENDER가 나갈 때 RECEIVER만 보이게
                WHEN CH_RECEIVER_ID = ? AND CH_ACTIVE = 1 THEN 2  -- RECEIVER가 나갈 때 SENDER만 보이게
                WHEN CH_SENDER_ID = ? AND CH_ACTIVE = 2 THEN 0    -- RECEIVER가 이미 나간 상태에서 SENDER가 나가면 0
                WHEN CH_RECEIVER_ID = ? AND CH_ACTIVE = 3 THEN 0  -- SENDER가 이미 나간 상태에서 RECEIVER가 나가면 0
                ELSE CH_ACTIVE
            END,
            CH_LAST_EXIT_TIME = NOW()
            WHERE CH_NO = ? AND (CH_SENDER_ID = ? OR CH_RECEIVER_ID = ?);
        `;

        DB.query(sql, [userId, userId, userId, userId, roomId, userId, userId], callback);
    }


}

module.exports = chatModel;