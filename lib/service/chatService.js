const DB = require('../db/db.js');

const chatService = {

    // 채팅방 생성
    createRoom: (req, res) => {

        let post = req.body;

        const query = `SELECT * FROM TBL_CHAT
                        WHERE (CH_SENDER_ID = ? AND CH_RECEIVER_ID = ? AND CH_PRODUCT_NO = ?)
                        UNION
                        SELECT * FROM TBL_CHAT
                        WHERE (CH_SENDER_ID = ? AND CH_RECEIVER_ID = ? AND CH_PRODUCT_NO = ?)`;

        const state = [post.my_id, post.u_id, post.p_no, post.u_id, post.my_id, post.p_no];

        DB.query(query, state, (err, results) => {

            if (err) {
                return res.render('chat/chat_ng');
            }

            if (results.length > 0) {
                const roomId = results[0].CH_NO;

                let oId, oNick, othum;

                if (post.my_id === results[0].CH_RECEIVER_ID) {
                    oId = results[0].CH_SENDER_ID;
                    oNick = results[0].CH_SENDER_NICK;
                    othum = post.u_thum;

                } else {
                    oId = results[0].CH_RECEIVER_ID;
                    oNick = results[0].CH_RECEIVER_NICK;
                    othum = post.u_thum;

                }
                console.log('oId', oId);
                console.log('oNick', oNick);
                console.log('othum', othum);
                res.render('chat/chat', {
                    roomId: roomId,
                    otherId: oId,
                    otherNick: oNick,
                    otherthum: othum,
                    loginedUser: req.user
                });

            } else {

                DB.query(`INSERT INTO TBL_CHAT (CH_SENDER_ID, CH_SENDER_NICK, CH_RECEIVER_ID, CH_RECEIVER_NICK, CH_PRODUCT_NO)
                            VALUES (?, ?, ?, ?, ?)`, 
                    [post.my_id, post.my_nick, post.u_id, post.u_nick, post.p_no], 
                    (err, insertResults) => {
                    if (err) {
                        console.log(err);
                        return res.render('chat/chat_ng');
                    }

                    const roomId = insertResults.insertId;

                    res.render('chat/chat', {
                        roomId: roomId,
                        otherId: post.u_id,
                        otherNick: post.u_nick,
                        otherthum: post.u_thum,
                        loginedUser: req.user
                    });
                });
            }
        });
    },


    // 채팅방 목록
    chatList: (req, res) => {

        DB.query(
            `SELECT * FROM TBL_CHAT WHERE CH_SENDER_ID = ? OR CH_RECEIVER_ID = ?`,
            [req.user.U_ID, req.user.U_ID],
            (error, chattingRooms) => {
                res.render('chat/chatList', {loginedUser: req.user, chattingRooms});
            }
        );
        
    },

    // 목록에서 채팅방 입장
    enterChatRoom: (req, res) => {
        console.log('3. deserializeUser: ', req.user);
        console.log("req.user:", req.user);
        const roomId = req.params.roomId;
    
        DB.query(
            `SELECT * FROM TBL_CHAT WHERE CH_NO = ?`, [roomId],
            (err, roomDetails) => {
                if (err || roomDetails.length === 0) {
                    return res.render('chat/chat_ng');
                }
    
                // 채팅방 상세 정보
                const room = roomDetails[0];

                let oId, oNick, othum;
                console.log("req.user:", req.user);

                if (req.user.U_ID === roomDetails[0].CH_RECEIVER_ID) {
                    oId = roomDetails[0].CH_SENDER_ID;
                    oNick = roomDetails[0].CH_SENDER_NICK;
                    othum = req.u_profile_thum;

                    console.log("oId, oNick, othum:", oId, oNick, othum);
                } else {
                    oId = roomDetails[0].CH_RECEIVER_ID;
                    oNick = roomDetails[0].CH_RECEIVER_NICK;
                    othum = req.u_profile_thum;

                    console.log("oId, oNick, othum", oId, oNick, othum);
                }
    
                res.render('chat/chat', {
                    roomId: roomId,
                    loginedUser: req.user,
                    room: room,
                    otherId: oId,
                    otherNick: oNick,
                    otherthum: othum,
                });
            }
        );
    },

    // 채팅방 메시지 기록 불러오기
    getChatHistory: (roomId, senderId, senderNick, otherId, otherNick) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    M.M_SENDER_ID AS senderId,
                    M.M_SENDER_NICK AS senderNick,
                    M.M_RECEIVER_ID AS otherId,
                    M.M_RECEIVER_NICK AS otherNick,
                    M.M_CONTENT AS message,
                    M.M_TIME AS time
                FROM TBL_MESSAGE M
                WHERE M.M_CHAT_CH_NO = ?
                ORDER BY M.M_TIME ASC
            `;

            DB.query(query, [roomId], (err, results) => {
                if (err) {
                    console.error('채팅 기록을 불러오는 중 오류 발생:', err);
                    reject(err); // 오류 발생 시 Promise reject
                } else {
                    // 이전 채팅 기록을 성공적으로 가져온 경우
                    resolve(results); // 채팅 기록을 반환
                }
            });
        });
    },

    // 메시지 저장하기
    saveMessage: ({ roomId, senderId, senderNick, otherId, otherNick, message }) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO TBL_MESSAGE 
                (M_CHAT_CH_NO, M_SENDER_ID, M_SENDER_NICK, M_RECEIVER_ID, M_RECEIVER_NICK, M_CONTENT)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const values = [roomId, senderId, senderNick, otherId, otherNick, message];

            DB.query(query, values, (err, result) => {
                if (err) {
                    console.error('메시지 저장 중 오류 발생:', err);
                    reject(err); // 오류 발생 시 Promise reject
                } else {
                    // 메시지 저장 성공 시
                    resolve(result);
                }
            });
        });
    }    


};

module.exports = chatService;
