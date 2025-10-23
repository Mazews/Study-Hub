
// Timer Pomodoro
const timerDisplay = document.querySelector('.timer-display');
const focusInput = document.getElementById('focus-time');
const breakInput = document.getElementById('break-time');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

let isFocusTime = true;
let timeLeft = parseInt(focusInput.value) * 60;
let timerId = null;
let isRunning = false;

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;

    timerId = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerId);
            isRunning = false;

            if (isFocusTime) {
                alert('☕ Tempo de pausa!');
                isFocusTime = false;
                timeLeft = parseInt(breakInput.value) * 60;
                startTimer();
            } else {
                alert('💪 Hora de focar novamente!');
                isFocusTime = true;
                timeLeft = parseInt(focusInput.value) * 60;
                startTimer();
            }
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    isFocusTime = true;
    timeLeft = parseInt(focusInput.value) * 60;
    updateDisplay();
}

focusInput.addEventListener('change', () => {
    if (!isRunning && isFocusTime) {
        timeLeft = parseInt(focusInput.value) * 60;
        updateDisplay();
    }
});

breakInput.addEventListener('change', () => {
    if (!isRunning && !isFocusTime) {
        timeLeft = parseInt(breakInput.value) * 60;
        updateDisplay();
    }
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();

// Todo List
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');

let tasks = [];

function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<li style="text-align: center; opacity: 0.5; cursor: default; border-style: dashed;">Nenhuma tarefa ainda...</li>';
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;

        if (task.completed) li.classList.add('completed');

        li.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            renderTasks();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            renderTasks();
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (text !== '') {
        tasks.push({ text, completed: false });
        taskInput.value = '';
        renderTasks();
    }
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

renderTasks();

// Sons ambiente
document.querySelectorAll('.sound-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('🎵 Reproduzindo: ' + btn.textContent);
    });
  });