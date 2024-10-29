const DB = require('../db/db.js');
const chatModel = require('../model/chatModel');

const chatService = {

    // 채팅방 생성
    createRoom: (req, res) => {

        let post = req.body;

        chatModel.checkChatRoomExist(post, (error, results) => {
            if (error) {
                return res.render('chat/chat_ng');
            }

            if (results.length > 0) {
                const roomId = results[0].CH_NO;
                let oId, oNick, othum;

                if (post.my_id === results[0].CH_RECEIVER_ID) {
                    oId = results[0].CH_SENDER_ID;
                    oNick = results[0].CH_SENDER_NICK;

                    chatModel.findUserById(oId, (error, userInfos) => {
                        othum = userInfos.U_PROFILE_THUM;

                    });

                } else {
                    oId = results[0].CH_RECEIVER_ID;
                    oNick = results[0].CH_RECEIVER_NICK;
                    
                    chatModel.findUserById(oId, (error, userInfos) => {
                        console.log("userInfos: ", userInfos);
                        othum = userInfos.U_PROFILE_THUM;

                    });

                }
                
                res.render('chat/chat', {
                    roomId: roomId,
                    otherId: oId,
                    otherNick: oNick,
                    otherthum: othum,
                    loginedUser: req.user
                });

            } else {

                chatModel.createChatRoom(post, (error, insertResults) => {
                    if (error) {
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

        chatModel.findChatRooms(req.user.U_ID, (error, chattingRooms) => {
            res.render('chat/chatList', {loginedUser: req.user, chattingRooms});
        });
        
    },

    // 목록에서 채팅방 입장
    enterChatRoom: (req, res) => {

        const roomId = req.params.roomId;
        chatModel.findChatRoomId(roomId, (error, roomDetails) => {
            
            if (error || roomDetails.length === 0) {
                return res.render('chat/chat_ng');
            }

            const room = roomDetails[0];
            let oId, oNick;
            
            if (req.user.U_ID === roomDetails[0].CH_RECEIVER_ID) {
                oId = roomDetails[0].CH_SENDER_ID;
                oNick = roomDetails[0].CH_SENDER_NICK;
                console.log("oId, oNick:1", oId, oNick);
            } else {
                oId = roomDetails[0].CH_RECEIVER_ID;
                oNick = roomDetails[0].CH_RECEIVER_NICK;
                console.log("oId, oNick:2", oId, oNick);
            }

            chatModel.findUserById(oId, (error, userInfos) => {
                    
                const othum = userInfos[0].U_PROFILE_THUM;
                console.log("userInfos: ", userInfos); // 확인용 로그
                console.log("oId, oNick, othum:", oId, oNick, othum);
    
                // findUserById가 완료된 후 res.render 호출
                res.render('chat/chat', {
                    roomId: roomId,
                    loginedUser: req.user,
                    room: room,
                    otherId: oId,
                    otherNick: oNick,
                    otherthum: othum,
                });
            });
        });

    },

    // 채팅방 메시지 기록 불러오기
    getChatHistory: (roomId, senderId, senderNick, otherId, otherNick) => {
        
        return new Promise((resolve, reject) => {
            chatModel.findChatMessage(roomId, senderId, senderNick, otherId, otherNick, (error, results) => {
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
                    reject(error); // 오류 발생 시 Promise reject
                } else {
                    resolve(result); // 메시지 저장 성공 시
                }
            });
        });

    }    


};

module.exports = chatService;
