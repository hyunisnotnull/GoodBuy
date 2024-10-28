const DB = require('../db/db.js');

const chatService = {

    // 채팅방 생성
    createRoom: (req, res) => {

        let post = req.body;

        const query = `SELECT * FROM TBL_CHAT
                        WHERE 
                        (CH_SENDER_ID = ? AND CH_RECEIVER_ID = ? AND CH_PRODUCT_NO = ?)
                        OR
                        (CH_SENDER_ID = ? AND CH_RECEIVER_ID = ? AND CH_PRODUCT_NO = ?)`;

        const state = [post.my_id, post.u_id, post.p_no, post.u_id, post.my_id, post.p_no];

        DB.query(query, state, (err, results) => {

            if (err) {
                return res.render('chat/chat_ng');
            }

            if (results.length > 0) {
                const roomId = results[0].CH_NO;

                let otherId, otherNick, otherthum;

                if (post.my_id === results[0].CH_RECEIVER_ID) {
                    
                }

                res.render('chat/chat', {
                    roomId: roomId,
                    otherId: post.u_id,
                    otherNick: post.u_nick,
                    otherthum: post.u_thum,
                    loginedUser: req.user
                });

            } else {

                DB.query(`INSERT INTO TBL_CHAT (CH_SENDER_ID, CH_SENDER_NICK, CH_RECEIVER_ID, CH_RECEIVER_NICK, CH_PRODUCT_NO)
                            VALUES (?, ?, ?, ?, ?)`, 
                    [post.my_id, post.my_nick, post.u_id, post.u_nick, post.p_no], 
                    (err, insertResults) => {
                    if (err) {
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
        const roomId = req.params.roomId;
    
        DB.query(
            `SELECT * FROM TBL_CHAT WHERE CH_NO = ?`, [roomId],
            (err, roomDetails) => {
                if (err || roomDetails.length === 0) {
                    return res.render('chat/chat_ng');
                }
    
                // 채팅방 상세 정보
                const room = roomDetails[0];
    
                res.render('chat/chat', {
                    roomId: roomId,
                    otherProfileImg: post.u_thum,
                    loginedUser: req.user,
                    room: room
                });
            }
        );
    },

    // 채팅 메시지 저장
    saveChatMessage: (userId, CH_BODY, roomId) => {
        const query = `
            UPDATE TBL_CHAT 
            SET CH_BODY = ?, CH_MOD_DATE = NOW() 
            WHERE CH_NO = ?
            AND (CH_OWNER_ID = ? OR CH_OTHER_ID = ?)
        `;
        const state = [CH_BODY, roomId, userId, userId];  // 메시지 내용, 채팅방 번호, 사용자 ID
    
        DB.query(query, state, (err) => {
            if (err) {
                console.error('메시지 저장 중 오류 발생:', err);  // 쿼리 실행 중 에러 발생 시 로그 출력
            } else {
                console.log('메시지가 성공적으로 저장되었습니다.');  // 성공 시 로그
            }
        });
    },
    

    // 이전 메시지 불러오기
    getChatHistory: (roomId, userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT CH_BODY, 
                       CASE 
                           WHEN CH_OWNER_ID = ? THEN CH_OWNER_ID 
                           ELSE CH_OTHER_ID 
                       END AS CH_USER_ID,
                       CASE 
                           WHEN CH_OWNER_ID = ? THEN CH_OWNER_NICK 
                           ELSE CH_OTHER_NICK 
                       END AS CH_USER_NICK,
                       CH_REG_DATE AS time,
                       U_PROFILE_THUM AS profileImg
                FROM TBL_CHAT 
                LEFT JOIN TBL_USER ON TBL_USER.U_ID = (CASE WHEN CH_OWNER_ID = ? THEN CH_OTHER_ID ELSE CH_OWNER_ID END)
                WHERE CH_NO = ?
                ORDER BY CH_REG_DATE ASC
            `;
            DB.query(query, [userId, userId, userId, roomId], (err, results) => {
                if (err) {
                    console.error('채팅 기록을 불러오는 중 오류 발생:', err);
                    reject(err);
                } else {
                    resolve(results);  // 채팅 메시지 목록을 클라이언트로 전송
                }
            });
        });
    },
    


};

module.exports = chatService;
