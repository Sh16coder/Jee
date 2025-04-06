// script.js - Part 1/3: Core Setup & Timetable Module

/*********************
 * CORE APPLICATION SETUP
 *********************/
const dailyQuotes = [
    { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    // ... (all 30 quotes from previous example)
];

// DOM Elements
const quoteElement = document.getElementById('daily-quote');
const authorElement = document.getElementById('quote-author');
const tabLinks = document.querySelectorAll('nav ul li');
const tabContents = document.querySelectorAll('.tab-content');

// Set daily quote
function setDailyQuote() {
    const today = new Date().getDate();
    const quoteIndex = (today - 1) % dailyQuotes.length;
    quoteElement.textContent = dailyQuotes[quoteIndex].quote;
    authorElement.textContent = dailyQuotes[quoteIndex].author;
}

// Tab switching functionality
function setupTabSwitching() {
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            tabLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            link.classList.add('active');
            const tabId = link.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/*********************
 * TIMETABLE MODULE
 *********************/
function initTimetable() {
    const addSlotBtn = document.getElementById('add-time-slot');
    const clearTimetableBtn = document.getElementById('clear-timetable');
    const addSlotModal = document.getElementById('add-slot-modal');
    const closeModal = document.querySelector('.close-modal');
    const timeSlotForm = document.getElementById('time-slot-form');
    
    // Event listeners
    addSlotBtn.addEventListener('click', () => addSlotModal.style.display = 'flex');
    closeModal.addEventListener('click', () => addSlotModal.style.display = 'none');
    
    clearTimetableBtn.addEventListener('click', clearTimetable);
    timeSlotForm.addEventListener('submit', handleTimeSlotSubmit);
    
    // Load initial timetable
    loadTimetable();
}

function clearTimetable() {
    if (confirm('Are you sure you want to clear your entire timetable?')) {
        localStorage.removeItem('jeeProdigyTimetable');
        document.getElementById('timetable-body').innerHTML = '';
        showNotification('Timetable Cleared', 'Your timetable has been cleared successfully.');
    }
}

function handleTimeSlotSubmit(e) {
    e.preventDefault();
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const day = document.getElementById('day').value;
    const activity = document.getElementById('activity').value;
    
    addTimeSlot(startTime, endTime, day, activity);
    e.target.reset();
    document.getElementById('add-slot-modal').style.display = 'none';
}

function addTimeSlot(startTime, endTime, day, activity) {
    const formattedStart = formatTime(startTime);
    const formattedEnd = formatTime(endTime);
    const timeRange = `${formattedStart} - ${formattedEnd}`;
    
    const timeSlot = document.createElement('div');
    timeSlot.className = 'time-slot';
    timeSlot.innerHTML = `
        <p class="time">${timeRange}</p>
        <p class="activity">${activity}</p>
    `;
    
    const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 
                     'Friday', 'Saturday', 'Sunday'].indexOf(day);
    
    const timeRows = Array.from(document.querySelectorAll('.timetable-body > div'));
    let existingRow = null;
    
    // Check for existing time slot
    for (let i = 0; i < timeRows.length; i++) {
        const rowTime = timeRows[i].firstChild.textContent;
        if (rowTime === timeRange) {
            existingRow = timeRows[i];
            break;
        }
    }
    
    const timetableBody = document.getElementById('timetable-body');
    
    if (existingRow) {
        // Add to existing row
        const dayCell = existingRow.children[dayIndex + 1];
        dayCell.innerHTML = '';
        dayCell.appendChild(timeSlot);
    } else {
        // Create new row
        const newRow = document.createElement('div');
        newRow.textContent = timeRange;
        
        // Create cells for each day
        for (let i = 0; i < 7; i++) {
            const dayCell = document.createElement('div');
            if (i === dayIndex) dayCell.appendChild(timeSlot);
            newRow.appendChild(dayCell);
        }
        
        // Insert in correct chronological order
        let inserted = false;
        for (let i = 0; i < timeRows.length; i++) {
            const rowTime = timeRows[i].firstChild.textContent.split(' - ')[0];
            if (compareTimes(formattedStart, rowTime) < 0) {
                timeRows[i].parentNode.insertBefore(newRow, timeRows[i]);
                inserted = true;
                break;
            }
        }
        
        if (!inserted) timetableBody.appendChild(newRow);
    }
    
    saveTimetable();
    preserveScrollPosition(timetableBody);
    return true;
}

function saveTimetable() {
    const timetableData = [];
    const timeRows = document.querySelectorAll('.timetable-body > div');
    
    timeRows.forEach(row => {
        const timeText = row.firstChild.textContent;
        if (timeText.includes(' - ')) {
            const [startTime, endTime] = timeText.split(' - ').map(t => t.trim());
            const days = Array.from(row.children).slice(1);
            
            days.forEach((dayCell, index) => {
                const activitySlot = dayCell.querySelector('.time-slot');
                if (activitySlot) {
                    const activity = activitySlot.querySelector('.activity').textContent;
                    const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 
                                'Friday', 'Saturday', 'Sunday'][index];
                    
                    timetableData.push({ startTime, endTime, day, activity });
                }
            });
        }
    });
    
    localStorage.setItem('jeeProdigyTimetable', JSON.stringify(timetableData));
}

function loadTimetable() {
    const savedTimetable = localStorage.getItem('jeeProdigyTimetable');
    if (!savedTimetable) return;
    
    const timetableData = JSON.parse(savedTimetable);
    const timetableBody = document.getElementById('timetable-body');
    timetableBody.innerHTML = '';
    
    const timeSlotMap = new Map();
    timetableData.forEach(slot => {
        const timeKey = `${slot.startTime} - ${slot.endTime}`;
        if (!timeSlotMap.has(timeKey)) timeSlotMap.set(timeKey, {});
        timeSlotMap.get(timeKey)[slot.day] = slot.activity;
    });
    
    timeSlotMap.forEach((dayActivities, timeRange) => {
        const row = document.createElement('div');
        row.textContent = timeRange;
        
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 
         'Friday', 'Saturday', 'Sunday'].forEach(day => {
            const dayCell = document.createElement('div');
            if (dayActivities[day]) {
                const timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot';
                timeSlot.innerHTML = `
                    <p class="time">${timeRange}</p>
                    <p class="activity">${dayActivities[day]}</p>
                `;
                dayCell.appendChild(timeSlot);
            }
            row.appendChild(dayCell);
        });
        
        timetableBody.appendChild(row);
    });
}

// Helper functions
function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes.padStart(2, '0')} ${ampm}`;
}

function compareTimes(time1, time2) {
    const [time1Str, period1] = time1.split(' ');
    const [time2Str, period2] = time2.split(' ');
    
    const [h1, m1] = time1Str.split(':').map(Number);
    const [h2, m2] = time2Str.split(':').map(Number);
    
    const hour1 = period1 === 'PM' && h1 !== 12 ? h1 + 12 : 
                 (period1 === 'AM' && h1 === 12 ? 0 : h1);
    const hour2 = period2 === 'PM' && h2 !== 12 ? h2 + 12 : 
                 (period2 === 'AM' && h2 === 12 ? 0 : h2);
    
    if (hour1 !== hour2) return hour1 - hour2;
    return m1 - m2;
}

function preserveScrollPosition(element) {
    const scrollPosition = element.scrollTop;
    element.style.visibility = 'hidden';
    element.style.visibility = 'visible';
    element.scrollTop = scrollPosition;
}

// Continue to Part 2 for Todo List and other modules...
// script.js - Part 2/3: Todo List & Question Practice Modules

/*********************
 * TO-DO LIST MODULE
 *********************/
function initTodoList() {
    const addTaskBtn = document.getElementById('add-task');
    const todoInput = document.getElementById('new-task');
    
    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterTasks(button.getAttribute('data-filter'));
        });
    });
    
    // Load initial tasks
    loadTasks();
    updateTaskStats();
}

function addTask() {
    const taskText = document.getElementById('new-task').value.trim();
    const taskTime = document.getElementById('task-time').value;
    
    if (!taskText) {
        showNotification('Empty Task', 'Please enter a task description.');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        time: taskTime || 'No time set',
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    addTaskToDOM(task);
    saveTask(task);
    document.getElementById('new-task').value = '';
    document.getElementById('task-time').value = '';
    updateTaskStats();
}

function addTaskToDOM(task) {
    const todoList = document.getElementById('todo-list');
    const taskItem = document.createElement('div');
    taskItem.className = `todo-item ${task.completed ? 'completed' : ''}`;
    taskItem.dataset.id = task.id;
    
    taskItem.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
        <div class="todo-text">${task.text}</div>
        <div class="todo-time">${task.time}</div>
        <div class="todo-actions">
            <button class="edit-task"><i class="fas fa-edit"></i></button>
            <button class="delete-task"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    // Add event listeners
    const checkbox = taskItem.querySelector('.todo-checkbox');
    const editBtn = taskItem.querySelector('.edit-task');
    const deleteBtn = taskItem.querySelector('.delete-task');
    
    checkbox.addEventListener('change', () => toggleTaskComplete(task.id, checkbox.checked));
    editBtn.addEventListener('click', () => editTask(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    todoList.appendChild(taskItem);
}

function toggleTaskComplete(taskId, isCompleted) {
    const tasks = getTasks().map(task => 
        task.id == taskId ? { ...task, completed: isCompleted } : task
    );
    localStorage.setItem('jeeProdigyTasks', JSON.stringify(tasks));
    
    const taskItem = document.querySelector(`.todo-item[data-id="${taskId}"]`);
    if (taskItem) {
        taskItem.classList.toggle('completed', isCompleted);
        if (isCompleted && Math.random() > 0.7) giveRandomReward();
    }
    
    updateTaskStats();
}

function editTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id == taskId);
    if (!task) return;
    
    const newText = prompt('Edit your task:', task.text);
    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        localStorage.setItem('jeeProdigyTasks', JSON.stringify(tasks));
        
        const taskItem = document.querySelector(`.todo-item[data-id="${taskId}"]`);
        if (taskItem) {
            taskItem.querySelector('.todo-text').textContent = newText.trim();
        }
    }
}

function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    const tasks = getTasks().filter(task => task.id != taskId);
    localStorage.setItem('jeeProdigyTasks', JSON.stringify(tasks));
    
    const taskItem = document.querySelector(`.todo-item[data-id="${taskId}"]`);
    if (taskItem) {
        taskItem.remove();
        if (!taskItem.classList.contains('completed') && Math.random() > 0.5) {
            giveRandomPunishment();
        }
    }
    
    updateTaskStats();
}

function filterTasks(filter) {
    const tasks = getTasks();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (filter === 'pending') filteredTasks = tasks.filter(task => !task.completed);
    if (filter === 'completed') filteredTasks = tasks.filter(task => task.completed);
    
    filteredTasks.forEach(task => addTaskToDOM(task));
}

function updateTaskStats() {
    const tasks = getTasks();
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('completed-tasks').textContent = completed;
    document.getElementById('pending-tasks').textContent = total - completed;
}

function loadTasks() {
    getTasks().forEach(task => addTaskToDOM(task));
}

function getTasks() {
    const tasksJSON = localStorage.getItem('jeeProdigyTasks');
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('jeeProdigyTasks', JSON.stringify(tasks));
}

/*********************
 * QUESTION PRACTICE MODULE
 *********************/
function initQuestionPractice() {
    const practiceForm = document.getElementById('question-practice-form');
    practiceForm.addEventListener('submit', startPracticeSession);
    
    document.getElementById('start-timer').addEventListener('click', startTimer);
    document.getElementById('stop-timer').addEventListener('click', stopTimer);
    document.getElementById('reset-timer').addEventListener('click', resetTimer);
    document.getElementById('submit-results').addEventListener('click', submitResults);
    
    loadPracticeHistory();
}

let currentSession = null;
let currentQuestion = 0;
let questionTimes = [];
let timerInterval = null;
let startTime = null;
let elapsedTime = 0;

function startPracticeSession(e) {
    e.preventDefault();
    
    currentSession = {
        date: document.getElementById('practice-date').value,
        chapter: document.getElementById('chapter').value,
        totalQuestions: parseInt(document.getElementById('total-questions').value),
        allottedTime: parseInt(document.getElementById('allotted-time').value),
        attemptedQuestions: 0,
        correctQuestions: 0,
        questionTimes: [],
        completed: false
    };
    
    currentQuestion = 0;
    questionTimes = [];
    
    // Update UI
    document.getElementById('current-chapter').textContent = currentSession.chapter;
    document.getElementById('session-questions').textContent = '0';
    document.getElementById('total-session-questions').textContent = currentSession.totalQuestions;
    
    // Show session section
    e.target.reset();
    document.getElementById('question-session').style.display = 'block';
    document.getElementById('session-complete').style.display = 'none';
    
    resetTimer();
}

function startTimer() {
    if (timerInterval) return;
    
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 1000);
    document.getElementById('start-timer').disabled = true;
    document.getElementById('stop-timer').disabled = false;
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    updateTimerDisplay(questionTimer, elapsedTime);
    
    // Update session time
    const totalElapsed = questionTimes.reduce((sum, time) => sum + time, 0) + elapsedTime;
    updateTimerDisplay(sessionTime, totalElapsed);
}

function updateTimerDisplay(element, time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    
    element.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function stopTimer() {
    if (!timerInterval) return;
    
    clearInterval(timerInterval);
    timerInterval = null;
    
    // Record time for this question
    questionTimes.push(elapsedTime);
    currentQuestion++;
    
    // Update UI
    document.getElementById('session-questions').textContent = currentQuestion;
    
    // Check if session is complete
    if (currentQuestion >= currentSession.totalQuestions) {
        completeSession();
    } else {
        resetTimer();
        startTimer();
    }
}

function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    elapsedTime = 0;
    document.getElementById('question-timer').textContent = '00:00:00';
    document.getElementById('start-timer').disabled = false;
    document.getElementById('stop-timer').disabled = true;
}

function completeSession() {
    currentSession.attemptedQuestions = currentQuestion;
    currentSession.questionTimes = questionTimes;
    document.getElementById('session-complete').style.display = 'block';
}

function submitResults() {
    const correctQuestions = parseInt(document.getElementById('correct-questions').value);
    
    if (isNaN(correctQuestions) {
        showNotification('Invalid Input', 'Please enter a valid number of correct questions.');
        return;
    }
    
    currentSession.correctQuestions = correctQuestions;
    currentSession.completed = true;
    
    // Calculate average time per question
    const totalTime = questionTimes.reduce((sum, time) => sum + time, 0);
    const avgTime = totalTime / questionTimes.length;
    
    // Save session
    savePracticeSession({
        date: currentSession.date,
        chapter: currentSession.chapter,
        totalQuestions: currentSession.totalQuestions,
        attemptedQuestions: currentSession.attemptedQuestions,
        correctQuestions: currentSession.correctQuestions,
        avgTime: avgTime
    });
    
    // Check performance
    const completionRatio = currentSession.attemptedQuestions / currentSession.totalQuestions;
    const accuracy = currentSession.correctQuestions / currentSession.attemptedQuestions;
    
    if (completionRatio >= 0.5) {
        giveRandomReward();
        if (accuracy >= 0.5) giveRandomReward('big');
    } else {
        giveRandomPunishment();
    }
    
    document.getElementById('question-session').style.display = 'none';
    currentSession = null;
}

function savePracticeSession(session) {
    const history = getPracticeHistory();
    history.push(session);
    localStorage.setItem('jeeProdigyQuestionHistory', JSON.stringify(history));
    loadPracticeHistory();
}

function loadPracticeHistory() {
    const history = getPracticeHistory();
    const historyTable = document.getElementById('question-history-table').querySelector('tbody');
    historyTable.innerHTML = '';
    
    history.forEach(session => {
        const row = document.createElement('tr');
        
        const avgTimeMinutes = Math.floor(session.avgTime / 60000);
        const avgTimeSeconds = Math.floor((session.avgTime % 60000) / 1000);
        const avgTimeStr = `${avgTimeMinutes}m ${avgTimeSeconds}s`;
        
        const completionRatio = session.attemptedQuestions / session.totalQuestions;
        const accuracy = session.correctQuestions / session.attemptedQuestions;
        
        let status = '';
        if (completionRatio >= 0.8 && accuracy >= 0.7) {
            status = '<span class="status-excellent">Excellent</span>';
        } else if (completionRatio >= 0.5 && accuracy >= 0.5) {
            status = '<span class="status-good">Good</span>';
        } else {
            status = '<span class="status-need-improvement">Needs Improvement</span>';
        }
        
        row.innerHTML = `
            <td>${session.date}</td>
            <td>${session.chapter}</td>
            <td>${session.totalQuestions}</td>
            <td>${session.attemptedQuestions}</td>
            <td>${session.correctQuestions}</td>
            <td>${avgTimeStr}</td>
            <td>${status}</td>
        `;
        
        historyTable.appendChild(row);
    });
}

function getPracticeHistory() {
    const historyJSON = localStorage.getItem('jeeProdigyQuestionHistory');
    return historyJSON ? JSON.parse(historyJSON) : [];
}

// Continue to Part 3 for remaining modules...
