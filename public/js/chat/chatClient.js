const socket = io(); // Socket.io 클라이언트 연결

const chatWindow = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');

// 메시지 보낸 시간 저장 변수
let lastMessageTime = null;
let lastSenderId = null;
let currentMessageGroup = null;

// lastExitTime의 유효성 검사
const validExitTime = lastExitTime && !isNaN(new Date(lastExitTime).getTime()) 
    ? new Date(new Date(lastExitTime).getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19)
    : null;

// 서버에 채팅방 입장을 알림
socket.emit('joinRoom', { roomId, senderId, senderNick, otherId, otherNick, otherthum, validExitTime });

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
        currentMessageGroup = document.createElement('div');
        currentMessageGroup.classList.add('message-container');

        const profileAndMessage = document.createElement('div');
        profileAndMessage.classList.add(data.senderId === senderId ? 'my-message-group' : 'other-message-group');

        

        // 상대방 메시지라면 프로필 사진과 닉네임 추가
        if (data.senderId !== senderId) {
            const profileContainer = document.createElement('div');
            profileContainer.classList.add('profile-container');

            const profileImage = document.createElement('img');
            profileImage.classList.add('chat-profile-image');
            profileImage.src = otherthum !== '' 
                ? `/${otherId}/${otherthum}` 
                : '/img/default_profile_thum.png';

            const nickname = document.createElement('span');
            nickname.classList.add('message-user');
            nickname.textContent = otherNick;

            profileContainer.appendChild(profileImage);
            profileContainer.appendChild(nickname);
            currentMessageGroup.appendChild(profileContainer);
        }

        currentMessageGroup.appendChild(profileAndMessage);
        chatWindow.appendChild(currentMessageGroup);

        lastMessageTime = formattedTime;
        lastSenderId = data.senderId;
    }

    // 이전 메시지 그룹에 있던 message-time 요소 제거
    const existingTimeElement = currentMessageGroup.querySelector('.message-time');
    if (existingTimeElement) {
        existingTimeElement.remove();
    }

    // 메시지 내용 추가
    const messageElement = document.createElement('div');
    messageElement.classList.add(data.senderId === senderId ? 'my-message' : 'other-message');
    messageElement.innerHTML = `<span class="message-text">${data.message}</span>`;

    const messageGroup = currentMessageGroup.querySelector(data.senderId === senderId ? '.my-message-group' : '.other-message-group');
    messageGroup.appendChild(messageElement);

    // 마지막 message에 대해 inline-block 스타일 적용
    const allMessages = messageGroup.querySelectorAll('.other-message, .my-message');
    allMessages.forEach((msg) => msg.style.display = 'block');
    if (allMessages.length > 0) {
        allMessages[allMessages.length - 1].style.display = 'inline-block';
    }

    // 마지막 메시지에 시간 표시
    const timeElement = document.createElement('div');
    timeElement.classList.add('message-time');
    timeElement.textContent = formattedTime;
    messageGroup.appendChild(timeElement);

    // 스크롤을 아래로 고정
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 채팅방 나가기
function goBack() {
    location.href = '/chat/chatList';
}

function deleteChat() {
    if (confirm("채팅방을 삭제하시겠습니까?")) {
        fetch(`/chat/delete/${roomId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert("채팅방이 삭제되었습니다.");
                window.location.href = "/chat/chatList";
            } else {
                alert("채팅방 삭제에 실패했습니다.");
            }
        })
        .catch(error => {
            console.error("채팅방 삭제 중 오류 발생:", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        });
    }
}