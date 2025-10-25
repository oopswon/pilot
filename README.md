# 간단한 채팅 웹

Socket.IO를 사용한 실시간 채팅 웹 애플리케이션입니다.

## 기능

- 실시간 메시지 전송 및 수신
- 사용자 입장/퇴장 알림
- 현재 접속자 수 표시
- 깔끔하고 모던한 UI
- XSS 방지 처리

## 기술 스택

- **백엔드**: Node.js, Express
- **실시간 통신**: Socket.IO
- **프론트엔드**: HTML, CSS, JavaScript

## 설치 및 실행

### 필수 요구사항

- Node.js (v14 이상)
- npm

### 설치

```bash
npm install
```

### 실행

```bash
npm start
```

서버가 포트 3000에서 실행됩니다. 브라우저에서 `http://localhost:3000`으로 접속하세요.

## 사용 방법

1. 브라우저에서 채팅방에 접속합니다.
2. 닉네임을 입력하고 입장합니다.
3. 메시지를 입력하고 전송 버튼을 클릭하거나 Enter 키를 눌러 메시지를 보냅니다.
4. 다른 사용자들과 실시간으로 대화할 수 있습니다.

## 프로젝트 구조

```
pilot/
├── server.js           # Express 서버 및 Socket.IO 설정
├── package.json        # 프로젝트 설정 및 의존성
├── public/            # 정적 파일
│   ├── index.html     # 메인 HTML
│   ├── style.css      # 스타일시트
│   └── app.js         # 클라이언트 측 JavaScript
└── README.md          # 프로젝트 문서
```

## 라이센스

ISC
