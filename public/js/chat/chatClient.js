// 소켓 초기화
const socket = io();

// HTML 요소 선택
const chatWindow = document.getElementById('chatWindow');  // 채팅 메시지가 표시될 창
const messageInput = document.getElementById('messageInput');  // 사용자가 입력할 메시지 필드

let lastSender = '';  // 마지막으로 메시지를 보낸 사용자의 ID를 저장
let lastTime = '';  // 마지막으로 메시지를 보낸 시간을 저장

// 페이지가 로드되면 채팅방에 참가
socket.emit('joinRoom', roomId);

// 이전 메시지를 불러와서 화면에 표시하는 함수
socket.on('previousMessages', (messages) => {
    messages.forEach((msg) => {
        const { CH_BODY, CH_OWNER_ID, CH_OTHER_ID, time, CH_OWNER_NICK, CH_OTHER_NICK, profileImg } = msg;
        
        const senderId = userId === CH_OWNER_ID ? CH_OWNER_ID : CH_OTHER_ID;
        const senderNick = userId === CH_OWNER_ID ? CH_OWNER_NICK : CH_OTHER_NICK;

        displayMessage({
            message: CH_BODY,
            username: senderId,
            nickname: senderNick,
            profileImg,
            time
        });
    });
});

// 메시지를 화면에 표시하는 함수
function displayMessage({ message, username, nickname, profileImg, time }) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    const isCurrentUser = username === userId;  // 현재 사용자인지 확인

    if (isCurrentUser) {
        // 내가 보낸 메시지 (오른쪽 정렬, 프로필 없이)
        messageElement.classList.add('right');
        const messageContent = `
            <div class="message-content">
                <p>${message}</p>
                <span class="time">${time}</span>
            </div>
        `;
        messageElement.innerHTML = messageContent;
    } else {
        // 상대방이 보낸 메시지 (왼쪽 정렬, 프로필 포함)
        messageElement.classList.add('left');

        // 같은 유저가 연속으로 메시지를 보낸 경우, 프로필과 닉네임을 생략
        if (username !== lastSender || time !== lastTime) {
            const userInfo = `
                <div class="user-info">
                    <img src="${profileImg || '/img/default_profile_thum.png'}" alt="profile" class="profile">
                    <strong>${nickname}</strong>
                </div>
            `;
            messageElement.innerHTML += userInfo;
        }

        const messageContent = `
            <div class="message-content">
                <p>${message}</p>
                <span class="time">${time}</span>
            </div>
        `;
        messageElement.innerHTML += messageContent;
    }

    // 마지막 메시지 보낸 사용자와 시간을 저장
    lastSender = username;
    lastTime = time;

    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;  // 자동으로 스크롤을 맨 아래로 이동
}

// 메시지 전송 함수
function sendMessage() {
    const message = messageInput.value;  // 입력된 메시지 값 가져오기
    if (message.trim() !== '') {  // 메시지가 공백이 아닐 때만 실행
        const data = {
            CH_BODY: message,  // 메시지를 CH_BODY에 저장
            CH_OWNER_ID: userId,  // 현재 사용자 ID
            CH_OWNER_NICK: userNick,  // 현재 사용자 닉네임
            roomId: roomId,  // roomId를 포함하여 서버로 전송
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // 메시지 전송 시간 (분까지만 표시)
            profileImg: '/img/my_profile.png'  // 예시 프로필 이미지 경로
        };
        socket.emit('chatMessage', data);  // 서버로 메시지 전송
        displayMessage(data);  // 내 메시지를 화면에 표시
        messageInput.value = '';  // 입력 필드 초기화
    }
}

// 서버에서 수신한 메시지를 화면에 표시하는 함수
socket.on('chatMessage', (data) => {
    const { CH_BODY, CH_OWNER_ID, CH_OTHER_ID, CH_OWNER_NICK, CH_OTHER_NICK, profileImg, time } = data;
    
    const senderId = userId === CH_OWNER_ID ? CH_OWNER_ID : CH_OTHER_ID;
    const senderNick = userId === CH_OWNER_ID ? CH_OWNER_NICK : CH_OTHER_NICK;

    displayMessage({
        message: CH_BODY,
        username: senderId,
        nickname: senderNick,
        profileImg,
        time
    });
});

// 뒤로 가기 버튼 클릭 시 동작하는 함수
function goBack() {
    window.history.back();  // 이전 페이지로 이동
}
