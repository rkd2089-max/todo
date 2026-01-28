// Firebase 설정 import
import { db } from './firebase.config.js';

// Firestore 함수 import
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    deleteDoc, 
    updateDoc, 
    doc, 
    Timestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const PASSWORD = 'jz2073jz';

// 전역 변수
let currentDate = new Date();
let selectedDate = null;
let currentTodoId = null;
let currentTodoContent = null;

// DOM 요소
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthText = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const selectedDateText = document.getElementById('selectedDateText');
const todoCount = document.getElementById('todoCount');
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');
const passwordModal = document.getElementById('passwordModal');
const editModal = document.getElementById('editModal');
const passwordInput = document.getElementById('passwordInput');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const errorMessage = document.getElementById('errorMessage');
const editTodoInput = document.getElementById('editTodoInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const modalTitle = document.getElementById('modalTitle');

// 날짜 포맷팅 함수
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateDisplay(date) {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

// 달력 렌더링
function renderCalendar() {
    calendarGrid.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 요일 헤더
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    weekdays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // 첫 번째 날짜
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // 달력 그리드 생성 (6주)
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        // 다른 달인 경우 빈 div 추가 (레이아웃 유지)
        if (date.getMonth() !== month) {
            const emptyElement = document.createElement('div');
            emptyElement.className = 'calendar-day-empty';
            calendarGrid.appendChild(emptyElement);
            continue;
        }
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // 오늘 날짜
        const today = new Date();
        if (formatDate(date) === formatDate(today)) {
            dayElement.classList.add('today');
        }
        
        // 선택된 날짜
        if (selectedDate && formatDate(date) === formatDate(selectedDate)) {
            dayElement.classList.add('selected');
        }
        
        dayElement.innerHTML = `<span class="day-number">${date.getDate()}</span>`;
        
        // 할 일이 있는 날짜 표시 (비동기)
        checkDateHasTodos(date).then(hasTodos => {
            if (hasTodos) {
                dayElement.classList.add('has-todos');
            }
        });
        
        dayElement.addEventListener('click', () => selectDate(date));
        calendarGrid.appendChild(dayElement);
    }
    
    // 현재 월 표시
    currentMonthText.textContent = `${year}년 ${month + 1}월`;
}

// 특정 날짜에 할 일이 있는지 확인
async function checkDateHasTodos(date) {
    if (!db) return false;
    
    try {
        const dateStr = formatDate(date);
        const todosRef = collection(db, 'todos');
        const q = query(todosRef, where('date', '==', dateStr));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch (error) {
        console.error('할 일 확인 오류:', error);
        return false;
    }
}

// 날짜 선택
async function selectDate(date) {
    selectedDate = date;
    selectedDateText.textContent = formatDateDisplay(date);
    renderCalendar();
    await loadTodos();
}

// 할 일 로드
async function loadTodos() {
    if (!selectedDate || !db) {
        if (!db) {
            todoList.innerHTML = '<div class="empty-state">Firebase 연결 중...</div>';
        }
        return;
    }
    
    try {
        const dateStr = formatDate(selectedDate);
        const todosRef = collection(db, 'todos');
        const q = query(todosRef, where('date', '==', dateStr));
        const snapshot = await getDocs(q);
        
        todoList.innerHTML = '';
        
        if (snapshot.empty) {
            todoList.innerHTML = '<div class="empty-state">등록된 할 일이 없습니다.</div>';
            todoCount.textContent = '';
            return;
        }
        
        const todos = [];
        snapshot.forEach(doc => {
            todos.push({ id: doc.id, ...doc.data() });
        });
        
        // 생성 시간 순으로 정렬
        todos.sort((a, b) => {
            const timeA = a.createdAt?.toMillis() || 0;
            const timeB = b.createdAt?.toMillis() || 0;
            return timeA - timeB;
        });
        
        todoCount.textContent = `${todos.length}개의 할 일`;
        
        todos.forEach(todo => {
            const todoItem = createTodoElement(todo);
            todoList.appendChild(todoItem);
        });
    } catch (error) {
        console.error('할 일 로드 오류:', error);
        todoList.innerHTML = '<div class="empty-state">할 일을 불러오는 중 오류가 발생했습니다.</div>';
    }
}

// 할 일 요소 생성
function createTodoElement(todo) {
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';
    if (todo.completed) {
        todoItem.classList.add('completed');
    }
    
    const createdAt = todo.createdAt?.toDate() || new Date();
    const createdDateStr = formatDateDisplay(createdAt);
    
    todoItem.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
               data-id="${todo.id}">
        <div class="todo-content-wrapper">
            <div class="todo-content">${escapeHtml(todo.content)}</div>
            <div class="todo-date">${createdDateStr}</div>
        </div>
        <div class="todo-actions">
            <button class="edit-btn" data-id="${todo.id}">수정</button>
            <button class="delete-btn" data-id="${todo.id}">삭제</button>
        </div>
    `;
    
    // 완료 체크박스 이벤트
    const checkbox = todoItem.querySelector('.todo-checkbox');
    checkbox.addEventListener('change', () => toggleTodoComplete(todo.id, checkbox.checked));
    
    // 수정 버튼 이벤트
    const editBtn = todoItem.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => openEditModal(todo));
    
    // 삭제 버튼 이벤트
    const deleteBtn = todoItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => openDeleteModal(todo.id));
    
    return todoItem;
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 할 일 추가
async function addTodo() {
    if (!selectedDate) {
        alert('날짜를 선택해주세요.');
        return;
    }
    
    if (!db) {
        alert('Firebase 연결이 되지 않았습니다. 페이지를 새로고침해주세요.');
        return;
    }
    
    const content = todoInput.value.trim();
    if (!content) {
        alert('할 일을 입력해주세요.');
        return;
    }
    
    try {
        const dateStr = formatDate(selectedDate);
        const todosRef = collection(db, 'todos');
        
        await addDoc(todosRef, {
            date: dateStr,
            content: content,
            password: PASSWORD,
            completed: false,
            createdAt: Timestamp.now()
        });
        
        todoInput.value = '';
        await loadTodos();
        renderCalendar(); // 달력 업데이트 (할 일 표시)
    } catch (error) {
        console.error('할 일 추가 오류:', error);
        alert('할 일 추가 중 오류가 발생했습니다.');
    }
}

// 할 일 완료 토글
async function toggleTodoComplete(todoId, completed) {
    if (!db) return;
    
    try {
        const todoRef = doc(db, 'todos', todoId);
        await updateDoc(todoRef, { completed: completed });
        await loadTodos();
    } catch (error) {
        console.error('완료 상태 변경 오류:', error);
        alert('상태 변경 중 오류가 발생했습니다.');
    }
}

// 수정 모달 열기 (비밀번호 확인 후)
function openEditModal(todo) {
    currentTodoId = todo.id;
    currentTodoContent = todo.content;
    // 먼저 비밀번호 확인
    modalTitle.textContent = '할 일 수정';
    passwordInput.value = '';
    passwordModal.classList.add('show');
    errorMessage.textContent = '';
}

// 삭제 모달 열기
function openDeleteModal(todoId) {
    currentTodoId = todoId;
    modalTitle.textContent = '할 일 삭제';
    passwordInput.value = '';
    passwordModal.classList.add('show');
    errorMessage.textContent = '';
}

// 비밀번호 확인 후 삭제
async function confirmDelete() {
    const password = passwordInput.value.trim();
    
    if (password !== PASSWORD) {
        errorMessage.textContent = '비밀번호가 일치하지 않습니다.';
        return;
    }
    
    if (!db) {
        alert('Firebase 연결이 되지 않았습니다.');
        return;
    }
    
    try {
        const todoRef = doc(db, 'todos', currentTodoId);
        await deleteDoc(todoRef);
        
        passwordModal.classList.remove('show');
        passwordInput.value = '';
        await loadTodos();
        renderCalendar(); // 달력 업데이트
    } catch (error) {
        console.error('할 일 삭제 오류:', error);
        alert('할 일 삭제 중 오류가 발생했습니다.');
    }
}

// 비밀번호 확인 후 수정 모달 열기
async function confirmEdit() {
    const password = passwordInput.value.trim();
    
    if (password !== PASSWORD) {
        errorMessage.textContent = '비밀번호가 일치하지 않습니다.';
        return;
    }
    
    passwordModal.classList.remove('show');
    passwordInput.value = '';
    errorMessage.textContent = '';
    
    // 수정 모달 열기 (할 일 내용 설정)
    editTodoInput.value = currentTodoContent || '';
    editModal.classList.add('show');
}

// 할 일 저장
async function saveEdit() {
    const content = editTodoInput.value.trim();
    
    if (!content) {
        alert('할 일을 입력해주세요.');
        return;
    }
    
    if (!db) {
        alert('Firebase 연결이 되지 않았습니다.');
        return;
    }
    
    try {
        const todoRef = doc(db, 'todos', currentTodoId);
        await updateDoc(todoRef, { content: content });
        
        editModal.classList.remove('show');
        await loadTodos();
    } catch (error) {
        console.error('할 일 수정 오류:', error);
        alert('할 일 수정 중 오류가 발생했습니다.');
    }
}

// 이전 달
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

// 다음 달
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// 이벤트 리스너
addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

prevMonthBtn.addEventListener('click', prevMonth);
nextMonthBtn.addEventListener('click', nextMonth);

confirmBtn.addEventListener('click', () => {
    if (modalTitle.textContent === '할 일 삭제') {
        confirmDelete();
    } else {
        confirmEdit();
    }
});

cancelBtn.addEventListener('click', () => {
    passwordModal.classList.remove('show');
    passwordInput.value = '';
    errorMessage.textContent = '';
});

saveEditBtn.addEventListener('click', saveEdit);
cancelEditBtn.addEventListener('click', () => {
    editModal.classList.remove('show');
});

editTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveEdit();
    }
});

// 모달 외부 클릭 시 닫기
passwordModal.addEventListener('click', (e) => {
    if (e.target === passwordModal) {
        passwordModal.classList.remove('show');
        passwordInput.value = '';
        errorMessage.textContent = '';
    }
});

editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.classList.remove('show');
    }
});

// 초기화
function init() {
    if (!db) {
        console.error('Firebase가 초기화되지 않았습니다.');
        alert('Firebase 연결에 실패했습니다. 페이지를 새로고침해주세요.');
        return;
    }
    
    renderCalendar();
    
    // 오늘 날짜 자동 선택
    const today = new Date();
    selectDate(today);
}

// 페이지 로드 시 초기화
window.addEventListener('load', init);
