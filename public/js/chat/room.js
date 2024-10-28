function updateChatHeader(otherNick, otherProfileImg) {
    const usernameElement = document.querySelector('.chat-header .username');
    const profileImgElement = document.querySelector('.chat-header .profile-img');

    usernameElement.textContent = otherNick;  // 상대방 닉네임 설정
    profileImgElement.src = otherProfileImg;  // 프로필 이미지 설정
}

// 채팅방 생성 후 서버에서 받은 데이터를 이용해 UI 업데이트
function createChatRoom(ownerId, ownerNick, otherId, otherNick) {
    fetch('/room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ownerId, ownerNick, otherId, otherNick }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.roomId) {
            // 채팅방 생성 성공 시 상대방 프로필과 닉네임을 업데이트
            updateChatHeader(data.otherNick, data.otherProfileImg);
        }
    })
    .catch(error => console.error('Error:', error));
}
