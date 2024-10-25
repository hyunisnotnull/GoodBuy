const socket = io(); // 서버로 소켓 연결

// 특정 채팅방(CH_NO)에 참여
const roomId = '<%= roomId %>'; // EJS로부터 CH_NO를 가져옴
socket.emit('joinRoom', roomId);

// 메시지 보내기
document.getElementById('sendMessageForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('messageInput').value;
    
    const senderId = '<%= user.M_ID %>';
    const senderNick = '<%= user.M_NICK %>';
    const receiverId = '<%= partner.M_ID %>';
    const receiverNick = '<%= partner.M_NICK %>';

    socket.emit('chatMessage', {
        roomId,
        senderId,
        senderNick,
        receiverId,
        receiverNick,
        message
    });

    document.getElementById('messageInput').value = '';
});

// 서버로부터 메시지 받기
socket.on('message', (data) => {
    const messageArea = document.getElementById('messages');
    const messageElement = document.createElement('li');
    messageElement.textContent = `${data.senderNick}: ${data.message}`;
    messageArea.appendChild(messageElement);
});
