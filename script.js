
document.addEventListener('DOMContentLoaded', () => {
  const timerDisplay = document.querySelector('.timer-display');
  const controlButtons = Array.from(document.querySelectorAll('.timer-controls button'));
  const focusInput = document.getElementById('focus-time');
  const breakInput = document.getElementById('break-time');

  const startBtn = controlButtons[0];
  const pauseBtn = controlButtons[1];
  const resetBtn = controlButtons[2];

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
});

document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTask");
  const taskList = document.getElementById("taskList");

  if (!taskInput || !addTaskBtn || !taskList) {
    console.error("❌ Elementos da lista de tarefas não foram encontrados no DOM.");
    return;
  }

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.textContent = task.text;

      if (task.completed) li.classList.add("completed");

      li.addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "✖";
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (text !== "") {
      tasks.push({ text, completed: false });
      taskInput.value = "";
      saveTasks();
      renderTasks();
    }
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  renderTasks();
});

renderTasks();