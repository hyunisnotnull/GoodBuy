const chatModel = require('../model/chatModel');
const { format, addHours } = require('date-fns');
const { ko } = require('date-fns/locale');

const chatService = {

    // 채팅방 생성
    createRoom: (req, res) => {

        let post = req.body;
        console.log('post', post);
    
        chatModel.checkChatRoomExist(post, (error, results) => {
            if (error) {
                return res.status(500).json({ message: "채팅방 생성 중 오류가 발생했습니다." });
            }
    
            if (results.length > 0) {
                const roomId = results[0].CH_NO;
                let oId, oNick, lastExitTime;
            
                // 사용자가 sender인지 receiver인지 확인
                if (req.user.U_ID === results[0].CH_RECEIVER_ID) {
                    oId = results[0].CH_SENDER_ID;
                    oNick = results[0].CH_SENDER_NICK;
                    lastExitTime = results[0].CH_RECEIVER_LAST_EXIT_TIME;
                    console.log("oId, oNick, lastExitTime:1", oId, oNick, lastExitTime);
                } else {
                    oId = results[0].CH_RECEIVER_ID;
                    oNick = results[0].CH_RECEIVER_NICK;
                    lastExitTime = results[0].CH_SENDER_LAST_EXIT_TIME;
                    console.log("oId, oNick, lastExitTime:2", oId, oNick, lastExitTime);
                }
            
                chatModel.findUserById(oId, (error, userInfos) => {
                    const othum = userInfos[0].U_PROFILE_THUM;
                    console.log("userInfos: ", userInfos);
                    console.log("oId, oNick, othum:", oId, oNick, othum);
                    
                    res.render('chat/chat', {
                        roomId: roomId,
                        otherId: oId,
                        otherNick: oNick,
                        otherthum: othum,
                        loginedUser: req.user,
                        lastExitTime: lastExitTime
                    });
    
                });
    
            } else {
    
                chatModel.createChatRoom(post, (error, insertResults) => {
                    if (error) {
                        return res.status(500).json({ message: "채팅방 생성 중 오류가 발생했습니다." });
                    }
    
                    const roomId = insertResults.insertId;
                    
                    chatModel.findUserById(post.u_id, (error, userInfos) => {
                                                
                        const othum = userInfos[0].U_PROFILE_THUM;
                        
                        res.render('chat/chat', {
                            roomId: roomId,
                            otherId: post.u_id,
                            otherNick: post.u_nick,
                            otherthum: othum,
                            loginedUser: req.user,
                            lastExitTime: null
                        });
                    });
                });
            }
        });
    
    },   

    // 채팅방 목록
    chatList: (req, res) => {

        chatModel.findChatRooms(req.user.U_ID, (error, chattingRooms) => {

            // 시간 형식을 변환
            chattingRooms = chattingRooms.map(room => {
                // UTC 시간을 한국 시간(KST)으로 변환 (UTC+9 시간 추가)
                const messageTimeKST = addHours(new Date(room.CH_TIME), 9);
                room.lastMessageTime = format(messageTimeKST, 'a h:mm', { locale: ko }); // '오후 5:30' 형식
                return room;
            });

            res.render('chat/chatList', {loginedUser: req.user, chattingRooms});
            console.log('chattingRooms', chattingRooms);
        });
        
    },

    // 목록에서 채팅방 입장
    enterChatRoom: (req, res) => {

        const roomId = req.params.roomId;

        // CH_UNREAD_COUNT를 0으로 초기화
        chatModel.resetUnreadCount(roomId, (error) => {
            if (error) {
                console.error('읽지 않은 메시지 카운트 초기화 중 오류 발생:', error);
            }
        });

        // TBL_CHAT 정보 찾기
        chatModel.findChatinfos(roomId, (error, roomDetails) => {
            
            if (error || roomDetails.length === 0) {
                return res.status(500).json({ message: "채팅방 입장 중 오류가 발생했습니다." });
            }

            const room = roomDetails[0];
            console.log("enterChatRoom, room: ", room);
            let oId, oNick, lastExitTime;
            
            if (req.user.U_ID === roomDetails[0].CH_RECEIVER_ID) {
                oId = roomDetails[0].CH_SENDER_ID;
                oNick = roomDetails[0].CH_SENDER_NICK;
                lastExitTime = roomDetails[0].CH_RECEIVER_LAST_EXIT_TIME;
                console.log("oId, oNick, lastExitTime:1", oId, oNick, lastExitTime);
            } else {
                oId = roomDetails[0].CH_RECEIVER_ID;
                oNick = roomDetails[0].CH_RECEIVER_NICK;
                lastExitTime = roomDetails[0].CH_SENDER_LAST_EXIT_TIME;
                console.log("oId, oNick, lastExitTime:2", oId, oNick, lastExitTime);
            }

            chatModel.findUserById(oId, (error, userInfos) => {
                    
                const othum = userInfos[0].U_PROFILE_THUM;
                console.log("userInfos: ", userInfos);
                console.log("oId, oNick, othum:", oId, oNick, othum);
    
                res.render('chat/chat', {
                    roomId: roomId,
                    loginedUser: req.user,
                    room: room,
                    otherId: oId,
                    otherNick: oNick,
                    otherthum: othum,
                    lastExitTime: lastExitTime
                });
            });
        });

    },

    // 채팅방 메시지 기록 불러오기
    getChatHistory: (roomId, senderId, senderNick, otherId, otherNick, validExitTime) => {
        
        return new Promise((resolve, reject) => {
            
            console.log("********validExitTime********: ", validExitTime);
            chatModel.findChatMessage(roomId, senderId, senderNick, otherId, otherNick, validExitTime, (error, results) => {
                if (error) {
                    console.error('채팅 기록을 불러오는 중 오류 발생:', error);
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
                    console.error('메시지 저장 중 오류 발생:', error);
                    return reject(error);
                }

                // CH_ACTIVE 상태 업데이트
                chatModel.updateChatStatus(roomId, senderId, (updateError) => {
                    if (updateError) {
                        console.error('채팅방 상태 업데이트 중 오류 발생:', updateError);
                        return reject(updateError);
                    }
                    
                    resolve(result);
                });
            });
        });
    },

    // 채팅방 삭제하기
    deleteChatRoom: (req, res) => {
        console.log("DELETE 요청 받음:", req.params.roomId);
        const roomId = req.params.roomId;
        const userId = req.user.U_ID;
    
        chatModel.exitChatRoom(roomId, userId, (error, result) => {
            if (error) {
                console.error('채팅방 삭제 중 오류 발생:', error);
                return res.status(500).json({ message: "채팅방 삭제에 실패했습니다." });
            }
            res.status(200).json({ message: "채팅방이 삭제되었습니다." });
        });
    },

    // TBL_MESSAGE에 이미지 메시지 생성
    createImageMessage: (roomId, senderId, senderNick, receiverId, receiverNick, callback) => {
        const messageData = {
            roomId,
            senderId,
            senderNick,
            receiverId,
            receiverNick,
            content: '[사진]',
        };

        chatModel.createMessage(messageData, (err, result) => {
            if (err) return callback(err);
            callback(null, result.insertId);
        });
    },

    // TBL_CHAT_IMAGE에 이미지 경로 저장
    saveChatImage: (messageId, imagePath, callback) => {

        chatModel.saveChatImage(messageId, imagePath, callback);
        
    }


};

module.exports = chatService;
