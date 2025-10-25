
'use strict';

/* ---------------------------------------------------------
                        TIMER POMODORO
--------------------------------------------------------- */

(() => {
  const timerDisplay = document.querySelector('.timer-display');
  const focusInput = document.getElementById('focus-time');
  const breakInput = document.getElementById('break-time');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');

  if (!timerDisplay || !focusInput || !breakInput) {
    console.error(' Elementos do timer não encontrados no DOM.');
    return;
  }

  let isFocusTime = true;
  let isRunning = false;
  let timeLeft = parseInt(focusInput.value) * 60;
  let timerId = null;

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const updateDisplay = () => {
    timerDisplay.textContent = formatTime(timeLeft);
  };

  const startTimer = () => {
    if (isRunning) return;
    isRunning = true;
    console.log('⏱️ Timer iniciado.');

    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerId);
        isRunning = false;
        const message = isFocusTime ? '☕ Tempo de pausa!' : '💪 Hora de focar novamente!';
        alert(message);
        isFocusTime = !isFocusTime;
        timeLeft = parseInt(isFocusTime ? focusInput.value : breakInput.value) * 60;
        startTimer();
      }
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerId);
    isRunning = false;
    console.log('⏸️ Timer pausado.');
  };

  const resetTimer = () => {
    clearInterval(timerId);
    isRunning = false;
    isFocusTime = true;
    timeLeft = parseInt(focusInput.value) * 60;
    updateDisplay();
    console.log('🔁 Timer resetado.');
  };

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
})();

/* ---------------------------------------------------------
                      LISTA DE TAREFAS
--------------------------------------------------------- */

(() => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');

  if (!taskInput || !addTaskBtn || !taskList) {
    console.error(' Elementos da lista de tarefas não encontrados.');
    return;
  }

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const renderTasks = () => {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
      taskList.innerHTML =
        '<li style="text-align:center;opacity:0.5;cursor:default;border-style:dashed;">Nenhuma tarefa ainda...</li>';
      return;
    }

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.textContent = task.text;
      if (task.completed) li.classList.add('completed');

      // Alternar conclusão
      li.addEventListener('click', () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      });

      // Botão de apagar
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '✖';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  };

  const addTask = () => {
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ text, completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
    console.log(` Tarefa adicionada: "${text}"`);
  };

  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  renderTasks();
})();

/* ---------------------------------------------------------
                     SONS AMBIENTE
--------------------------------------------------------- */

(() => {
  const soundButtons = document.querySelectorAll('.sound-btn');
  if (!soundButtons.length) return;

  // Links dos áudios
  const sounds = {
    '🌧️ Chuva': new Audio('assets/chuva.mp3'),
    '⛈️ Tempestade': new Audio('assets/tempestade.mp3'),
    '🔥 Fogueira': new Audio('assets/fogueira.mp3'),
    '💨 Vento': new Audio('assets/vento.mp3'),
    '🐦‍⬛ Pássaros': new Audio('assets/passaros.mp3'),
  };

  // configurações iniciais
  Object.values(sounds).forEach(audio => {
    audio.loop = true;
    audio.volume = 0.5;
  });

  // controle de botões
   soundButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sound = sounds[btn.textContent.trim()];
      if (!sound) return;
    
      // pausa todos os outros
          Object.values(sounds).forEach(a => a.pause());
      document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));

            // se o botão clicado estava tocando, para
      if (!sound.paused) {
        sound.pause();
        btn.classList.remove('active');
      } else {
        sound.play().catch(err => console.error('Erro ao tocar som:', err));
        btn.classList.add('active');
      }
    });
  });
})();
