const socket = io();

// DOM 요소
const usernameModal = document.getElementById('username-modal');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messagesDiv = document.getElementById('messages');
const userCountSpan = document.getElementById('user-count');

let username = '';

// 페이지 로드 시 모달 표시
window.addEventListener('load', () => {
    usernameInput.focus();
});

// 입장 버튼 클릭
joinBtn.addEventListener('click', joinChat);

// 엔터키로 입장
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinChat();
    }
});

// 채팅방 입장 함수
function joinChat() {
    const name = usernameInput.value.trim();
    if (name) {
        username = name;
        socket.emit('join', username);
        usernameModal.classList.add('hidden');
        messageInput.focus();
    }
}

// 메시지 전송 버튼 클릭
sendBtn.addEventListener('click', sendMessage);

// 엔터키로 메시지 전송
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 메시지 전송 함수
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('chat message', message);
        messageInput.value = '';
        messageInput.focus();
    }
}

// 메시지 수신
socket.on('chat message', (data) => {
    addMessage(data.username, data.message, data.timestamp);
});

// 사용자 입장 알림
socket.on('user joined', (data) => {
    addSystemMessage(`${data.username}님이 입장했습니다.`);
    updateUserCount(data.userCount);
});

// 사용자 퇴장 알림
socket.on('user left', (data) => {
    addSystemMessage(`${data.username}님이 퇴장했습니다.`);
    updateUserCount(data.userCount);
});

// 메시지 추가 함수
function addMessage(username, message, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-header">
                <span class="username">${escapeHtml(username)}</span>
                <span class="timestamp">${timestamp}</span>
            </div>
            <div class="message-text">${escapeHtml(message)}</div>
        </div>
    `;

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 시스템 메시지 추가 함수
function addSystemMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = message;

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 접속자 수 업데이트
function updateUserCount(count) {
    userCountSpan.textContent = `접속자: ${count}명`;
}

// XSS 방지를 위한 HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
