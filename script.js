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
  const focusModeBtn = document.getElementById('focusModeBtn');
  const breakModeBtn = document.getElementById('breakModeBtn');

  if (!timerDisplay || !focusInput || !breakInput) {
    console.error('❌ Elementos do timer não encontrados no DOM.');
    return;
  }

  let isFocusTime = true;
  let isRunning = false;
  let timeLeft = parseInt(focusInput.value) * 60;
  let timerId = null;
  let sessions = 0; // Contador de sessões concluídas

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const updateModeButtons = () => {
    if (focusModeBtn && breakModeBtn) {
      if (isFocusTime) {
        focusModeBtn.classList.add('active-mode');
        breakModeBtn.classList.remove('active-mode');
      } else {
        focusModeBtn.classList.remove('active-mode');
        breakModeBtn.classList.add('active-mode');
      }
    }
  };

  const updateDisplay = () => {
    timerDisplay.textContent = formatTime(timeLeft);
    updateModeButtons();
    // Atualiza título da página
    document.title = `${formatTime(timeLeft)} - ${isFocusTime ? 'Foco' : 'Pausa'} | StudyHub`;
  };

  const playSound = () => {
    // Som de notificação (opcional - você pode adicionar um arquivo de som)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjSO1fLTfS0GIHzM8OOXSAwYXrXk6qVZFgo+ltDxwHkkBjSO1fLTfS0GIHzM8OOXSAwYXrXk6qVZFgo+ltDxwHkkBjSO1fLTfS0GIHzM8OOXSAwYXrXk6qVZFgo+ltDxwHkkBjSO1fLTfS0GIHzM8OOXSAwYXrXk6qVZFgo+ltDxwHkkBg==');
    audio.play().catch(() => {});
  };

  const startTimer = () => {
    if (isRunning) return;
    isRunning = true;
    startBtn.textContent = '▶ Iniciado...';
    startBtn.disabled = true;

    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerId);
        isRunning = false;
        startBtn.textContent = '▶ Iniciar';
        startBtn.disabled = false;
        playSound();

        if (isFocusTime) {
          sessions++;
          alert(`☕ Pausa! Você completou ${sessions} sessão(ões) de foco.`);
          // Não inicia automaticamente - usuário precisa clicar
          isFocusTime = false;
          timeLeft = parseInt(breakInput.value) * 60;
        } else {
          alert('💪 Hora de focar novamente!');
          isFocusTime = true;
          timeLeft = parseInt(focusInput.value) * 60;
        }
        updateDisplay();
      }
    }, 1000);
  };

  const pauseTimer = () => {
    if (!isRunning) return;
    clearInterval(timerId);
    isRunning = false;
    startBtn.textContent = '▶ Iniciar';
    startBtn.disabled = false;
    console.log('⏸️ Timer pausado.');
  };

  const resetTimer = () => {
    clearInterval(timerId);
    isRunning = false;
    timeLeft = parseInt(isFocusTime ? focusInput.value : breakInput.value) * 60;
    startBtn.textContent = '▶ Iniciar';
    startBtn.disabled = false;
    updateDisplay();
    console.log('🔄 Timer resetado.');
  };

  const switchToFocus = () => {
    if (isRunning) {
      pauseTimer();
    }
    isFocusTime = true;
    timeLeft = parseInt(focusInput.value) * 60;
    updateDisplay();
    console.log('🎯 Modo Foco ativado');
  };

  const switchToBreak = () => {
    if (isRunning) {
      pauseTimer();
    }
    isFocusTime = false;
    timeLeft = parseInt(breakInput.value) * 60;
    updateDisplay();
    console.log('☕ Modo Pausa ativado');
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
  
  // Event listeners para os botões de modo
  if (focusModeBtn) {
    focusModeBtn.addEventListener('click', switchToFocus);
    console.log('✅ Botão Foco conectado');
  }
  if (breakModeBtn) {
    breakModeBtn.addEventListener('click', switchToBreak);
    console.log('✅ Botão Pausa conectado');
  }

  updateDisplay();
  console.log('✅ Timer Pomodoro carregado');
})();

/* ---------------------------------------------------------
                      LISTA DE TAREFAS
--------------------------------------------------------- */

(() => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');

  if (!taskInput || !addTaskBtn || !taskList) {
    console.error('❌ Elementos da lista de tarefas não encontrados.');
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

      li.addEventListener('click', () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      });

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
    console.log(`✅ Tarefa adicionada: "${text}"`);
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
  // Mapa de sons
  const soundMap = {
    'Chuva': new Audio('assets/chuva.mp3'),
    'Fogueira': new Audio('assets/fogueira.mp3'),
    'Vento': new Audio('assets/vento.mp3'),
    'Passaros': new Audio('assets/passaros.mp3'),
    'Lofi': new Audio('https://stream.zeno.fm/lofi')
  };

  // Configurar todos os sons
  Object.values(soundMap).forEach(sound => {
    sound.loop = true;
    sound.volume = 0.5;
  });

  const soundBtns = document.querySelectorAll('.sound-btn');
  const sliders = document.querySelectorAll('.volume-slider');
  const pauseAllBtn = document.getElementById('pauseAll');

  if (!soundBtns.length || !sliders.length) {
    console.error('❌ Elementos de som não encontrados');
    return;
  }

  // Ativar/desativar sons individualmente
  soundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sound;
      const sound = soundMap[key];
      
      if (!sound) {
        console.error(`❌ Som não encontrado: ${key}`);
        return;
      }

      if (sound.paused) {
        sound.play()
          .then(() => {
            btn.classList.add('active');
            console.log(`🎵 Reproduzindo: ${key}`);
          })
          .catch(err => console.error(`❌ Erro ao reproduzir ${key}:`, err));
      } else {
        sound.pause();
        btn.classList.remove('active');
        console.log(`⏸️ Pausado: ${key}`);
      }
    });
  });

  // Ajustar volume individual
  sliders.forEach(slider => {
    slider.addEventListener('input', () => {
      const soundKey = slider.dataset.sound;
      
      // Mapeamento correto dos data-sound para as chaves do soundMap
      const keyMap = {
        'rain': 'Chuva',
        'fire': 'Fogueira',
        'cafe': 'Vento',
        'birds': 'Passaros',
        'lofi': 'Lofi'
      };

      const key = keyMap[soundKey];
      const sound = soundMap[key];
      
      if (sound) {
        sound.volume = parseFloat(slider.value);
        console.log(`🔊 Volume de ${key}: ${Math.round(slider.value * 100)}%`);
      }
    });
  });

  // Pausar todos os sons
  if (pauseAllBtn) {
    pauseAllBtn.addEventListener('click', () => {
      Object.values(soundMap).forEach(sound => {
        sound.pause();
        sound.currentTime = 0; // Resetar para o início
      });
      soundBtns.forEach(btn => btn.classList.remove('active'));
      console.log('⏸️ Todos os sons pausados');
    });
  }

  console.log('✅ Sistema de sons ambiente carregado');
})();