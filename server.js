const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// 정적 파일 제공
app.use(express.static('public'));

// 루트 경로
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 접속한 사용자들 관리
const users = new Map();

// Socket.IO 연결 처리
io.on('connection', (socket) => {
  console.log('새로운 사용자가 접속했습니다:', socket.id);

  // 사용자 입장
  socket.on('join', (username) => {
    users.set(socket.id, username);
    io.emit('user joined', {
      username,
      userCount: users.size
    });
    console.log(`${username}님이 입장했습니다. (현재 인원: ${users.size}명)`);
  });

  // 메시지 수신 및 브로드캐스트
  socket.on('chat message', (msg) => {
    const username = users.get(socket.id);
    io.emit('chat message', {
      username,
      message: msg,
      timestamp: new Date().toLocaleTimeString('ko-KR')
    });
  });

  // 사용자 퇴장
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      io.emit('user left', {
        username,
        userCount: users.size
      });
      console.log(`${username}님이 퇴장했습니다. (현재 인원: ${users.size}명)`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`채팅 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`http://localhost:${PORT} 에서 접속하세요.`);
});
