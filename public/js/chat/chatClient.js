const socket = io(); // Socket.io 클라이언트 연결

const chatWindow = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');

// 메시지 보낸 시간 저장 변수
let lastMessageTime = null;

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
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    const profileAndMessage = document.createElement('div');
    profileAndMessage.classList.add(data.senderId === senderId ? 'my-message-group' : 'other-message-group');

    // 현재 시각 (오전/오후, 시, 분 단위) 형식으로 표시
    const messageTime = new Date(data.time);
    const hours = messageTime.getHours();
    const minutes = messageTime.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const formattedHours = (hours % 12) || 12;
    const formattedTime = `${ampm} ${formattedHours}:${minutes}`;

    // 현재 메시지 시간이 마지막 메시지 시간과 같은지 확인
    const isSameTimeAsLastMessage = lastMessageTime === formattedTime;
    lastMessageTime = formattedTime; // 마지막 메시지 시간을 현재 시간으로 업데이트

    if (data.senderId !== senderId && !isSameTimeAsLastMessage) {
        // 상대 메시지의 프로필 사진 및 닉네임
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

    // 메시지 내용
    const messageElement = document.createElement('div');
    messageElement.classList.add(data.senderId === senderId ? 'my-message' : 'other-message');
    messageElement.innerHTML = `<span class="message-text">${data.message}</span>`;

    // 시간 표시
    const timeElement = document.createElement('span');
    timeElement.classList.add('message-time');
    timeElement.textContent = formattedTime;

    profileAndMessage.appendChild(messageElement);
    messageContainer.appendChild(profileAndMessage);
    messageContainer.appendChild(timeElement);

    chatWindow.appendChild(messageContainer);
    chatWindow.scrollTop = chatWindow.scrollHeight; // 스크롤을 아래로 고정
}

// 채팅방 나가기
function goBack() {
    window.history.back();
}
