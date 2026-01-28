# 📅 오늘의 할 일 (Calendar To-Do App)

날짜별로 할 일을 관리할 수 있는 달력 기반 To-Do 웹앱입니다.

## ✨ 주요 기능

### 핵심 기능
- 📆 **달력 표시**: 월별 달력에서 날짜 선택
- ✅ **할 일 추가**: 선택한 날짜에 할 일 추가
- 📋 **할 일 목록 조회**: 날짜별 할 일 목록 확인
- ✏️ **할 일 수정**: 비밀번호 확인 후 할 일 수정
- 🗑️ **할 일 삭제**: 비밀번호 확인 후 할 일 삭제
- 🔒 **비밀번호 보호**: 수정/삭제 시 비밀번호 확인

### 추가 기능
- ✅ **완료 체크**: 할 일 완료/미완료 상태 토글
- 📍 **오늘 날짜 강조**: 오늘 날짜 자동 강조 표시
- 🔄 **달 이동**: 이전 달/다음 달 이동 버튼
- 📊 **할 일 개수 표시**: 선택한 날짜의 할 일 개수 표시
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla JS)
- **Backend/Database**: Firebase Firestore
- **인증**: 비밀번호 기반 (로그인 불필요)

## 📁 프로젝트 구조

```
todo/
├── index.html          # 메인 HTML 파일
├── style.css           # 스타일시트
├── script.js           # 메인 JavaScript 로직
├── firebase.config.js  # Firebase 설정 및 초기화
└── README.md           # 프로젝트 문서
```

## 🚀 시작하기

### 1. 저장소 클론 또는 다운로드

```bash
git clone https://github.com/your-username/todo.git
cd todo
```

### 2. Firebase 설정

`firebase.config.js` 파일에 Firebase 프로젝트 설정이 이미 포함되어 있습니다. 

만약 다른 Firebase 프로젝트를 사용하려면 `firebase.config.js` 파일의 설정을 수정하세요:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Firestore 데이터베이스 설정

Firebase Console에서 Firestore Database를 활성화하고, 다음 규칙을 설정하세요:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{document=**} {
      allow read, write: if true; // 개발용 - 프로덕션에서는 보안 규칙 적용 권장
    }
  }
}
```

### 4. 로컬 서버 실행

#### 방법 1: Python 사용
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### 방법 2: Node.js (http-server) 사용
```bash
npx http-server -p 8000
```

#### 방법 3: VS Code Live Server 확장 사용
VS Code에서 `index.html` 파일을 우클릭하고 "Open with Live Server" 선택

### 5. 브라우저에서 열기

브라우저에서 `http://localhost:8000` 또는 로컬 서버 주소로 접속하세요.

**참고**: Firebase는 HTTPS 또는 localhost에서만 정상 작동합니다. 파일을 직접 열면(`file://`) CORS 오류가 발생할 수 있으므로 반드시 로컬 서버를 사용하세요.

## 📖 사용 방법

1. **날짜 선택**: 달력에서 원하는 날짜를 클릭합니다.
2. **할 일 추가**: 하단의 입력 필드에 할 일을 입력하고 "추가" 버튼을 클릭합니다.
3. **할 일 완료**: 할 일 항목의 체크박스를 클릭하여 완료 상태를 변경합니다.
4. **할 일 수정**: "수정" 버튼을 클릭하고 비밀번호(`jz2073jz`)를 입력한 후 내용을 수정합니다.
5. **할 일 삭제**: "삭제" 버튼을 클릭하고 비밀번호(`jz2073jz`)를 입력하여 삭제합니다.

## 🔐 비밀번호

기본 비밀번호: `jz2073jz`

할 일 수정 및 삭제 시 이 비밀번호가 필요합니다.

## 📊 데이터 구조

Firestore의 `todos` 컬렉션에 다음 형식으로 데이터가 저장됩니다:

```javascript
{
  date: "2026-01-28",           // 날짜 (YYYY-MM-DD)
  content: "운동하기",           // 할 일 내용
  password: "jz2073jz",          // 수정/삭제용 비밀번호
  completed: false,              // 완료 여부
  createdAt: Timestamp          // 생성 시간
}
```

## 🎨 주요 특징

- **반응형 디자인**: 모든 디바이스에서 최적화된 UI
- **직관적인 인터페이스**: 사용하기 쉬운 간단한 디자인
- **실시간 동기화**: Firebase를 통한 실시간 데이터 저장
- **로그인 불필요**: 간단한 비밀번호로 바로 사용 가능

## 🌐 브라우저 지원

- Chrome (권장)
- Firefox
- Safari
- Edge

## 📝 라이선스

이 프로젝트는 개인 사용 및 학습 목적으로 자유롭게 사용할 수 있습니다.

## 🤝 기여

버그 리포트, 기능 제안, Pull Request를 환영합니다!

## 📧 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 등록해주세요.

---

**Made with ❤️ using Firebase & Vanilla JavaScript**
