const chatModel = require('../model/chatModel');
const { format, addHours } = require('date-fns');
const { ko } = require('date-fns/locale');

// 에러 코드
function handleError(res, message, error = null) {
    if (error) console.error(message, error);
    return res.status(500).json({ message });
}

// 반복되는 코드
function getRequiredInfos(req, reqInfos) {
    if (req.user.U_ID === reqInfos.CH_RECEIVER_ID) {
        return {
            oId: reqInfos.CH_SENDER_ID,
            oNick: reqInfos.CH_SENDER_NICK,
            lastExitTime: reqInfos.CH_RECEIVER_LAST_EXIT_TIME
        };
    } else {
        return {
            oId: reqInfos.CH_RECEIVER_ID,
            oNick: reqInfos.CH_RECEIVER_NICK,
            lastExitTime: reqInfos.CH_SENDER_LAST_EXIT_TIME
        };
    }
}

// UTC 시간을 KST(한국)으로 변환 (UTC+9 시간 추가)
function convertToKST(date) {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Seoul' };
    return new Intl.DateTimeFormat('ko-KR', options).format(new Date(date));
}

const chatService = {

    // 채팅방 생성
    createRoom: (req, res) => {
        let post = req.body;
        console.log('post', post);
    
        chatModel.checkChatRoomExist(post, (error, results) => {
            if (error) return handleError(res, "채팅방 생성: 생성된 방 확인 중 오류.", error);
    
            if (results.length > 0) {
                const roomId = results[0].CH_NO;

                // 필요한 정보
                const { oId, oNick, lastExitTime } = getRequiredInfos(req, results[0]);
                        
                chatModel.findUserById(oId, (error, userInfos) => {
                    if (error) return handleError(res, "채팅방 생성: 정보 조회 중 오류.", error);

                    const othum = userInfos[0].U_PROFILE_THUM;
                    
                    res.render('chat/chat', {
                        roomId: roomId, 
                        otherId: oId, 
                        otherNick: oNick, 
                        otherthum: othum,
                        loginedUser: req.user, 
                        lastExitTime: lastExitTime, 
                        isAdminChat: null
                    });
                });
            } else {
                chatModel.createChatRoom(post, (error, insertResults) => {
                    if (error) return handleError(res, "채팅방 생성: 새로운 방 생성 중 오류.", error);
    
                    const roomId = insertResults.insertId;
                    chatModel.findUserById(post.u_id, (error, userInfos) => {
                        if (error) return handleError(res, "채팅방 생성: 방 생성 후 정보 조회 중 오류.", error);

                        const othum = userInfos[0].U_PROFILE_THUM;
                        res.render('chat/chat', {
                            roomId: roomId,
                            otherId: post.u_id,
                            otherNick: post.u_nick,
                            otherthum: othum,
                            loginedUser: req.user,
                            lastExitTime: null,
                            isAdminChat: null
                        });
                    });
                });
            }
        });
    },   

    // 채팅방 목록
    chatList: (req, res) => {
        chatModel.findChatRooms(req.user.U_ID, (error, chattingRooms) => {
            if (error) return handleError(res, "채팅방 목록: 유저 채팅방 조회 중 오류.", error);

            // 시간 변환
            chattingRooms = chattingRooms.map(room => {
                room.lastMessageTime = convertToKST(room.CH_TIME);
                return room;
            });

            chatModel.findAdminChatRooms(req.user.U_ID, (error, adminChatRooms) => {
                if (error) return handleError(res, "채팅방 목록: 관리자 채팅방 조회 중 오류.", error);

                // 시간 변환
                adminChatRooms = adminChatRooms.map(room => {
                    room.lastMessageTime = convertToKST(room.AC_TIME);
                    return room;
                });

                // 두 채팅 목록을 하나로 병합, 시간순으로 정렬
                const allChatRooms = [...chattingRooms, ...adminChatRooms].sort((a, b) => {
                    return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
                });

                res.render('chat/chatList', {loginedUser: req.user, allChatRooms});
            });
        });
    },

    // 목록에서 채팅방 입장
    enterChatRoom: (req, res) => {
        const roomId = req.params.roomId;

        chatModel.resetUnreadCount(roomId, (error) => {
            if (error) console.error('목록to채팅방: 읽지 않은 메시지 카운트 초기화 중 오류.', error);
        });

        chatModel.findChatinfos(roomId, (error, roomDetails) => {
            if (error || roomDetails.length === 0) {
                return handleError(res, "목록to채팅방: 채팅방 정보 찾기 중 오류.", error);
            }

            const room = roomDetails[0];

            // 필요한 정보
            const { oId, oNick, lastExitTime } = getRequiredInfos(req, room);

            chatModel.findUserById(oId, (error, userInfos) => {
                if (error) return handleError(res, "목록to채팅방: 유저 정보 조회 중 오류.", error);

                const othum = userInfos[0].U_PROFILE_THUM;
    
                res.render('chat/chat', {
                    roomId: roomId,
                    loginedUser: req.user,
                    room: room,
                    otherId: oId,
                    otherNick: oNick,
                    otherthum: othum,
                    lastExitTime: lastExitTime,
                    isAdminChat: null
                });
            });
        });
    },

    // 채팅방 메시지 기록 불러오기
    getChatHistory: (roomId, senderId, senderNick, otherId, otherNick, validExitTime) => {
        return new Promise((resolve, reject) => {

            chatModel.findChatMessage(roomId, senderId, senderNick, otherId, otherNick, validExitTime, (error, results) => {
                if (error) {
                    console.error('메시지 기록: 불러오는 중 오류.', error);
                    reject(error); // 오류 발생 시 Promise reject
                } else {
                    resolve(results); // 채팅 기록을 반환
                }
            });
        });
    },

    // 메시지 저장하기
    saveMessage: ({ roomId, senderId, senderNick, otherId, otherNick, message }) => {
        return new Promise((resolve, reject) => {
            const values = [roomId, senderId, senderNick, otherId, otherNick, message];
            
            chatModel.saveChattings(values, (error, result) => {
                if (error) {
                    console.error('메시지 저장: 불러오는 중 오류.', error);
                    return reject(error);
                }

                chatModel.updateChatStatus(roomId, senderId, (updateError) => {
                    if (updateError) {
                        console.error('메시지 저장: 채팅방 상태 업데이트 중 오류.', updateError);
                        return reject(updateError);
                    }
                    resolve(result);
                });
            });
        });
    },

    // 채팅방 삭제하기
    deleteChatRoom: (req, res) => {
        const roomId = req.params.roomId;
        const userId = req.user.U_ID;
    
        chatModel.exitChatRoom(roomId, userId, (error, result) => {
            if (error) return handleError(res, "채팅방 삭제: 중 오류.", error);
            res.status(200).json({ message: "채팅방이 삭제되었습니다." });
        });
    },

    // 메시지와 이미지를 함께 저장하는 함수
    saveMessageWithImage: (roomId, senderId, senderNick, receiverId, receiverNick, imagePath, callback) => {
        const messageData = {
            roomId,
            senderId,
            senderNick,
            receiverId,
            receiverNick,
            content: `<img src="${imagePath}" class="chat-image">`,
        };

        // TBL_MESSAGE에 메시지를 저장, M_NO를 얻은 후 TBL_CHAT_IMAGE에 저장
        chatModel.createMessage(messageData, (error, messageId) => {
            if (error) return callback(error);

            // 이미지 경로를 TBL_CHAT_IMAGE에 저장
            chatModel.saveChatImage(messageId, imagePath, (imageErr) => {
                if (imageErr) return callback(imageErr);
                callback(null, messageId); // 성공 시 메시지 ID 반환
            });
        });
    },

    // 문의하기 생성 또는 조회
    createAdminChat: (req, res) => {
        if (req.user === undefined) {
            return res.redirect('/user/sign_in_form');
        }

        const senderId = req.user.U_ID;
        const senderNick = req.user.U_NICK;

        chatModel.findAdminChat(senderId, (error, adminChat) => {
            if (error) return handleError(res, "문의하기: 채팅방 조회 중 오류.", error);

            let room = adminChat[0];

            // 채팅방 없음
            if (adminChat.length === 0) {
                chatModel.createAdminChat(senderId, senderNick, (createError, result) => {
                    if (createError) return handleError(res, "문의하기: 채팅방 생성 오류", createError);

                    const newChatId = result.insertId;
                    room = { ISADMINCHAT: 1 };

                    res.render('chat/chatA', { 
                        roomId: newChatId,
                        otherId: '관리자',              
                        otherNick: '관리자',            
                        otherthum: '/img/admin_profile.png',
                        loginedUser: req.user,
                        lastExitTime: null,
                        room: room
                    });
                });
            } else {

                res.render('chat/chatA', { 
                    roomId: room.AC_NO, 
                    otherId: '관리자',              
                    otherNick: '관리자',            
                    otherthum: '/img/admin_profile.png',
                    loginedUser: req.user,
                    lastExitTime: null,
                    room: room
                });
            }
        });
    },

    // 관리자 채팅방 입장
    enterAdminChatRoom: (req, res) => {
        const roomId = req.params.roomId;

        chatModel.resetAdminUnreadCount(roomId, (error) => {
            if (error) return handleError(res, "관리자 채팅방 입장: 읽지 않은 메시지 초기화 오류.", error);
        });

        chatModel.findAdminChatRoom(roomId, (error, roomDetails) => {
            if (error || roomDetails.length === 0) {
                return handleError(res, "관리자 채팅방 입장: 정보 조회 중 오류.", error);
            }

            const room = roomDetails[0];
            res.render('chat/chatA', { 
                roomId, 
                room, 
                loginedUser: req.user,
            });
        });
    },

};

module.exports = chatService;