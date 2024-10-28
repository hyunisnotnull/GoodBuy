// chatClient.js

const socket = io(); // Socket.io 클라이언트 연결

const chatWindow = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');

// 서버에 채팅방 입장을 알림
socket.emit('joinRoom', { roomId, userId, userNick });

// 메시지 전송 함수
function sendMessage() {
    const message = messageInput.value.trim();

    if (message) {
        // 서버로 메시지 전송
        socket.emit('chatMessage', { roomId, userId, userNick, message });

        // 전송 후 입력 필드 초기화
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
    const messageElement = document.createElement('li');
    messageElement.classList.add('message');

    if (data.userId === userId) {
        messageElement.classList.add('my-message');
    } else {
        messageElement.classList.add('other-message');
    }

    messageElement.innerHTML = `
        <span class="message-user">${data.userNick}</span>
        <span class="message-text">${data.message}</span>
        <span class="message-time">${new Date(data.time).toLocaleTimeString()}</span>
    `;

    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // 스크롤을 아래로 고정
}

// 채팅방 나가기
function goBack() {
    window.history.back();
}
