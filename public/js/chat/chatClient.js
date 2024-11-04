const socket = io(); // Socket.io 클라이언트 연결

const chatWindow = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');

// 메시지 보낸 시간 저장 변수
let lastMessageTime = null;
let lastSenderId = null;
let currentMessageGroup = null;

// 서버에 채팅방 입장을 알림
socket.emit('joinRoom', { roomId, senderId, senderNick, otherId, otherNick, otherthum });

// 메시지 전송 함수
function sendMessage() {
    const message = messageInput.value.trim();

    if (message) {
        // 서버로 메시지 전송
        socket.emit('chatMessage', 
                    { roomId, senderId, senderNick, otherId, otherNick, message });

        messageInput.value = '';
        messageInput.focus();
    }
}

// 엔터키로 메시지 전송
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// 서버로부터 메시지 수신
socket.on('message', (data) => {
    displayMessage(data);
});

// 메시지를 화면에 출력하는 함수
function displayMessage(data) {
    const messageTime = new Date(data.time);
    const hours = messageTime.getHours();
    const minutes = messageTime.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const formattedHours = (hours % 12) || 12;
    const formattedTime = `${ampm} ${formattedHours}:${minutes}`;

    const isSameTimeAsLastMessage = lastMessageTime === formattedTime;
    const isSameSenderAsLastMessage = data.senderId === lastSenderId;

    // 새로운 메시지 그룹이 필요한지 확인
    if (!isSameTimeAsLastMessage || !isSameSenderAsLastMessage) {
        // 이전 메시지 그룹이 있다면 시간 표시 추가
        if (currentMessageGroup) {
            const timeElement = document.createElement('span');
            timeElement.classList.add('message-time');
            timeElement.textContent = lastMessageTime;
            currentMessageGroup.appendChild(timeElement);
        }

        // 새로운 메시지 그룹 생성
        currentMessageGroup = document.createElement('div');
        currentMessageGroup.classList.add('message-container');

        const profileAndMessage = document.createElement('div');
        profileAndMessage.classList.add(data.senderId === senderId ? 'my-message-group' : 'other-message-group');

        // 상대방 메시지라면 프로필 사진과 닉네임 추가
        if (data.senderId !== senderId) {
            const profileImage = document.createElement('img');
            profileImage.classList.add('chat-profile-image');
            profileImage.src = otherthum !== '' 
                ? `/${otherId}/${otherthum}` 
                : '/img/default_profile_thum.png';

            const nickname = document.createElement('span');
            nickname.classList.add('message-user');
            nickname.textContent = otherNick;

            profileAndMessage.appendChild(profileImage);
            profileAndMessage.appendChild(nickname);
        }

        currentMessageGroup.appendChild(profileAndMessage);
        chatWindow.appendChild(currentMessageGroup);

        // 마지막 메시지 시간과 발신자 정보 업데이트
        lastMessageTime = formattedTime;
        lastSenderId = data.senderId;
    }

    // 메시지 내용 추가
    const messageElement = document.createElement('div');
    messageElement.classList.add(data.senderId === senderId ? 'my-message' : 'other-message');
    messageElement.innerHTML = `<span class="message-text">${data.message}</span>`;

    // 메시지를 현재 메시지 그룹에 추가
    currentMessageGroup.querySelector(data.senderId === senderId ? '.my-message-group' : '.other-message-group').appendChild(messageElement);

    // 스크롤을 아래로 고정
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 채팅방 나가기
function goBack() {
    window.history.back();
}
