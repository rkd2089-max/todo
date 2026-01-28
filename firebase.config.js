// Firebase 설정 및 초기화
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBTh7yT8ePDPAUqai6IF07D8YFBbG6oXJc",
    authDomain: "todo-b1aa5.firebaseapp.com",
    projectId: "todo-b1aa5",
    storageBucket: "todo-b1aa5.firebasestorage.app",
    messagingSenderId: "363058318250",
    appId: "1:363058318250:web:3d508ffc10668c449139d3"
};

// Firebase 초기화
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('✅ Firebase 연결 성공!');
} catch (error) {
    console.error('❌ Firebase 연결 실패:', error);
    throw error;
}

// Firebase 인스턴스 export
export { app, db };
