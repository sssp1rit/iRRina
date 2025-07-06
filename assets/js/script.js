document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const showAll = document.getElementById('show-all');
    const showActive = document.getElementById('show-active');
    const showCompleted = document.getElementById('show-completed');
    const totalCount = document.getElementById('total-count');
    const activeCount = document.getElementById('active-count');
    const completedCount = document.getElementById('completed-count');
    
    // Массив задач
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Функция сохранения задач в localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateCounters();
    }
    
    // Функция обновления счетчиков
    function updateCounters() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const active = total - completed;
        
        totalCount.textContent = total;
        activeCount.textContent = active;
        completedCount.textContent = completed;
    }
    
    // Функция отображения задач
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'text-gray-500 italic';
            emptyMessage.textContent = filter === 'all' ? 'Нет задач. Добавьте первую задачу!' : 
                                      filter === 'active' ? 'Нет активных задач' : 'Нет завершенных задач';
            taskList.appendChild(emptyMessage);
        } else {
            filteredTasks.forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.className = 'bg-gray-50 p-3 rounded-lg flex items-center justify-between transition hover:bg-gray-100';
                taskItem.style.animationDelay = `${index * 0.1}s`;
                
                const taskText = document.createElement('span');
                taskText.className = task.completed ? 'task-completed' : '';
                taskText.textContent = task.text;
                
                const taskActions = document.createElement('div');
                taskActions.className = 'flex space-x-2';
                
                const completeButton = document.createElement('button');
                completeButton.className = task.completed ? 
                    'bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition' : 
                    'bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition';
                completeButton.innerHTML = task.completed ? '<i class="fas fa-check"></i>' : '<i class="far fa-circle"></i>';
                completeButton.addEventListener('click', () => toggleTaskComplete(task.id));
                
                const deleteButton = document.createElement('button');
                deleteButton.className = 'bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition';
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.addEventListener('click', () => deleteTask(task.id));
                
                taskActions.appendChild(completeButton);
                taskActions.appendChild(deleteButton);
                
                taskItem.appendChild(taskText);
                taskItem.appendChild(taskActions);
                
                taskList.appendChild(taskItem);
            });
        }
    }
    
    // Функция добавления задачи
    function addTask(e) {
        e.preventDefault();
        
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Пожалуйста, введите текст задачи');
            return;
        }
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        
        taskInput.value = '';
        
        // Анимация добавления
        const taskItems = document.querySelectorAll('#task-list li');
        if (taskItems.length > 0) {
            const lastTask = taskItems[taskItems.length - 1];
            lastTask.style.opacity = '0';
            lastTask.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                lastTask.style.transition = 'all 0.3s ease-out';
                lastTask.style.opacity = '1';
                lastTask.style.transform = 'translateY(0)';
            }, 10);
        }
    }
    
    // Функция переключения статуса задачи
    function toggleTaskComplete(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
    }
    
    // Функция удаления задачи
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
    
    // Обработчики событий
    taskForm.addEventListener('submit', addTask);
    showAll.addEventListener('click', () => {
        renderTasks('all');
        updateActiveButton('all');
    });
    showActive.addEventListener('click', () => {
        renderTasks('active');
        updateActiveButton('active');
    });
    showCompleted.addEventListener('click', () => {
        renderTasks('completed');
        updateActiveButton('completed');
    });
    
    // Функция обновления активной кнопки фильтра
    function updateActiveButton(filter) {
        showAll.className = 'px-3 py-1 rounded-l-md';
        showActive.className = 'px-3 py-1';
        showCompleted.className = 'px-3 py-1 rounded-r-md';
        
        if (filter === 'all') {
            showAll.className += ' bg-purple-600 text-white';
            showActive.className += ' bg-gray-200 text-gray-700';
            showCompleted.className += ' bg-gray-200 text-gray-700';
        } else if (filter === 'active') {
            showAll.className += ' bg-gray-200 text-gray-700';
            showActive.className += ' bg-purple-600 text-white';
            showCompleted.className += ' bg-gray-200 text-gray-700';
        } else {
            showAll.className += ' bg-gray-200 text-gray-700';
            showActive.className += ' bg-gray-200 text-gray-700';
            showCompleted.className += ' bg-purple-600 text-white';
        }
    }
    
    // Инициализация
    updateCounters();
    renderTasks();
    updateActiveButton('all');
    
    // Анимация для кнопки добавления задачи
    if (taskInput) {
        taskInput.addEventListener('focus', () => {
            taskForm.querySelector('button').classList.add('pulse');
        });
        
        taskInput.addEventListener('blur', () => {
            taskForm.querySelector('button').classList.remove('pulse');
        });
    }
});