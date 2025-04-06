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
// script.js - Part 3/3: Diary, Rewards & Core Functions

/*********************
 * DIARY MODULE
 *********************/
function initDiary() {
    document.getElementById('diary-date').valueAsDate = new Date();
    document.getElementById('load-diary').addEventListener('click', loadDiaryForDate);
    document.getElementById('save-diary').addEventListener('click', saveDiaryEntry);
    document.getElementById('clear-diary').addEventListener('click', clearDiaryEntry);
    
    loadDiaryForDate(new Date().toISOString().split('T')[0]);
    loadDiaryHistory();
}

function loadDiaryForDate(date = null) {
    const selectedDate = date || document.getElementById('diary-date').value;
    const entries = getDiaryEntries();
    const entry = entries.find(e => e.date === selectedDate);
    document.getElementById('diary-text').value = entry ? entry.text : '';
}

function saveDiaryEntry() {
    const date = document.getElementById('diary-date').value;
    const text = document.getElementById('diary-text').value.trim();
    
    if (!text) {
        showNotification('Empty Entry', 'Diary entry cannot be empty.');
        return;
    }
    
    const entries = getDiaryEntries();
    const existingIndex = entries.findIndex(e => e.date === date);
    
    if (existingIndex !== -1) {
        entries[existingIndex].text = text;
    } else {
        entries.push({ date, text });
    }
    
    localStorage.setItem('jeeProdigyDiaryEntries', JSON.stringify(entries));
    showNotification('Entry Saved', 'Your diary entry has been saved successfully.');
    loadDiaryHistory();
}

function clearDiaryEntry() {
    if (confirm('Are you sure you want to clear this diary entry?')) {
        document.getElementById('diary-text').value = '';
    }
}

function loadDiaryHistory() {
    const entries = getDiaryEntries().sort((a, b) => 
        new Date(b.date) - new Date(a.date));
    const historyList = document.getElementById('diary-history-list');
    historyList.innerHTML = '';
    
    entries.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'diary-entry-item';
        entryElement.innerHTML = `
            <div class="diary-entry-date">${formatDate(entry.date)}</div>
            <div class="diary-entry-text">${entry.text.substring(0, 100)}${entry.text.length > 100 ? '...' : ''}</div>
        `;
        
        entryElement.addEventListener('click', () => {
            document.getElementById('diary-date').value = entry.date;
            loadDiaryForDate(entry.date);
            document.querySelector(`nav ul li[data-tab="diary"]`).click();
        });
        
        historyList.appendChild(entryElement);
    });
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

function getDiaryEntries() {
    const entriesJSON = localStorage.getItem('jeeProdigyDiaryEntries');
    return entriesJSON ? JSON.parse(entriesJSON) : [];
}

/*********************
 * REWARDS & PUNISHMENTS MODULES
 *********************/
function initRewards() {
    document.getElementById('add-reward').addEventListener('click', addReward);
    document.getElementById('new-reward').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addReward();
    });
    loadRewards();
    loadEarnedRewards();
}

function initPunishments() {
    document.getElementById('add-punishment').addEventListener('click', addPunishment);
    document.getElementById('new-punishment').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPunishment();
    });
    loadPunishments();
    loadReceivedPunishments();
}

// Rewards functions
function addReward() {
    const text = document.getElementById('new-reward').value.trim();
    if (!text) {
        showNotification('Empty Reward', 'Please enter a reward description.');
        return;
    }
    
    const reward = { id: Date.now(), text };
    addRewardToDOM(reward);
    saveReward(reward);
    document.getElementById('new-reward').value = '';
}

function addRewardToDOM(reward) {
    const rewardsList = document.getElementById('rewards-list');
    const rewardItem = document.createElement('div');
    rewardItem.className = 'reward-item';
    rewardItem.dataset.id = reward.id;
    rewardItem.innerHTML = `
        <div class="reward-text">${reward.text}</div>
        <div class="reward-actions">
            <button class="delete-reward"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    rewardItem.querySelector('.delete-reward').addEventListener('click', () => deleteReward(reward.id));
    rewardsList.appendChild(rewardItem);
}

function deleteReward(rewardId) {
    if (!confirm('Are you sure you want to delete this reward?')) return;
    
    const rewards = getRewards().filter(reward => reward.id != rewardId);
    localStorage.setItem('jeeProdigyRewards', JSON.stringify(rewards));
    document.querySelector(`.reward-item[data-id="${rewardId}"]`)?.remove();
}

function giveRandomReward(size = 'normal') {
    const rewards = getRewards();
    if (!rewards.length) {
        showNotification('No Rewards', 'Add rewards in the Rewards section!');
        return;
    }
    
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    const earnedReward = {
        id: Date.now(),
        rewardId: randomReward.id,
        text: randomReward.text,
        date: new Date().toISOString(),
        size
    };
    
    const earnedRewards = getEarnedRewards();
    earnedRewards.push(earnedReward);
    localStorage.setItem('jeeProdigyEarnedRewards', JSON.stringify(earnedRewards));
    
    showNotification('Reward Earned!', `You've earned ${size === 'big' ? 'a BIG' : 'a'} reward: ${randomReward.text}`);
    loadEarnedRewards();
}

function loadRewards() {
    document.getElementById('rewards-list').innerHTML = '';
    getRewards().forEach(reward => addRewardToDOM(reward));
}

function loadEarnedRewards() {
    const earnedRewards = getEarnedRewards()
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    const earnedList = document.getElementById('earned-rewards-list');
    earnedList.innerHTML = '';
    
    earnedRewards.forEach(reward => {
        const rewardItem = document.createElement('div');
        rewardItem.className = 'earned-reward-item';
        
        const date = new Date(reward.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        rewardItem.innerHTML = `
            <div><strong>${reward.text}</strong></div>
            <div>Earned on: ${dateStr}</div>
            ${reward.size === 'big' ? '<div class="big-reward">BIG REWARD!</div>' : ''}
        `;
        
        earnedList.appendChild(rewardItem);
    });
}

function getRewards() {
    const rewardsJSON = localStorage.getItem('jeeProdigyRewards');
    return rewardsJSON ? JSON.parse(rewardsJSON) : [];
}

function saveReward(reward) {
    const rewards = getRewards();
    rewards.push(reward);
    localStorage.setItem('jeeProdigyRewards', JSON.stringify(rewards));
}

function getEarnedRewards() {
    const earnedJSON = localStorage.getItem('jeeProdigyEarnedRewards');
    return earnedJSON ? JSON.parse(earnedJSON) : [];
}

// Punishments functions (similar structure to rewards)
function addPunishment() {
    const text = document.getElementById('new-punishment').value.trim();
    if (!text) {
        showNotification('Empty Punishment', 'Please enter a punishment description.');
        return;
    }
    
    const punishment = { id: Date.now(), text };
    addPunishmentToDOM(punishment);
    savePunishment(punishment);
    document.getElementById('new-punishment').value = '';
}

function addPunishmentToDOM(punishment) {
    const punishmentsList = document.getElementById('punishments-list');
    const punishmentItem = document.createElement('div');
    punishmentItem.className = 'punishment-item';
    punishmentItem.dataset.id = punishment.id;
    punishmentItem.innerHTML = `
        <div class="punishment-text">${punishment.text}</div>
        <div class="punishment-actions">
            <button class="delete-punishment"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    punishmentItem.querySelector('.delete-punishment').addEventListener('click', () => deletePunishment(punishment.id));
    punishmentsList.appendChild(punishmentItem);
}

function deletePunishment(punishmentId) {
    if (!confirm('Are you sure you want to delete this punishment?')) return;
    
    const punishments = getPunishments().filter(p => p.id != punishmentId);
    localStorage.setItem('jeeProdigyPunishments', JSON.stringify(punishments));
    document.querySelector(`.punishment-item[data-id="${punishmentId}"]`)?.remove();
}

function giveRandomPunishment() {
    const punishments = getPunishments();
    if (!punishments.length) {
        showNotification('No Punishments', 'Add punishments in the Punishments section!');
        return;
    }
    
    const randomPunishment = punishments[Math.floor(Math.random() * punishments.length)];
    const receivedPunishment = {
        id: Date.now(),
        punishmentId: randomPunishment.id,
        text: randomPunishment.text,
        date: new Date().toISOString()
    };
    
    const receivedPunishments = getReceivedPunishments();
    receivedPunishments.push(receivedPunishment);
    localStorage.setItem('jeeProdigyReceivedPunishments', JSON.stringify(receivedPunishments));
    
    showNotification('Punishment Received', `You've received a punishment: ${randomPunishment.text}`);
    loadReceivedPunishments();
}

function loadPunishments() {
    document.getElementById('punishments-list').innerHTML = '';
    getPunishments().forEach(punishment => addPunishmentToDOM(punishment));
}

function loadReceivedPunishments() {
    const receivedPunishments = getReceivedPunishments()
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    const receivedList = document.getElementById('received-punishments-list');
    receivedList.innerHTML = '';
    
    receivedPunishments.forEach(punishment => {
        const punishmentItem = document.createElement('div');
        punishmentItem.className = 'received-punishment-item';
        
        const date = new Date(punishment.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        punishmentItem.innerHTML = `
            <div><strong>${punishment.text}</strong></div>
            <div>Received on: ${dateStr}</div>
        `;
        
        receivedList.appendChild(punishmentItem);
    });
}

function getPunishments() {
    const punishmentsJSON = localStorage.getItem('jeeProdigyPunishments');
    return punishmentsJSON ? JSON.parse(punishmentsJSON) : [];
}

function savePunishment(punishment) {
    const punishments = getPunishments();
    punishments.push(punishment);
    localStorage.setItem('jeeProdigyPunishments', JSON.stringify(punishments));
}

function getReceivedPunishments() {
    const receivedJSON = localStorage.getItem('jeeProdigyReceivedPunishments');
    return receivedJSON ? JSON.parse(receivedJSON) : [];
}

/*********************
 * RESOURCES MODULE
 *********************/
function initResources() {
    document.getElementById('add-resource').addEventListener('click', addResource);
    document.getElementById('resource-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addResource();
    });
    
    document.querySelectorAll('.resource-filter').forEach(filter => {
        filter.addEventListener('click', () => {
            document.querySelectorAll('.resource-filter').forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            filterResources(filter.getAttribute('data-filter'));
        });
    });
    
    loadResources();
}

function addResource() {
    const name = document.getElementById('resource-name').value.trim();
    const type = document.getElementById('resource-type').value.trim();
    const link = document.getElementById('resource-link').value.trim();
    
    if (!name) {
        showNotification('Empty Name', 'Please enter a resource name.');
        return;
    }
    
    const resource = {
        id: Date.now(),
        name,
        type: type || 'Other',
        link: link || '#',
        addedDate: new Date().toISOString()
    };
    
    addResourceToDOM(resource);
    saveResource(resource);
    
    document.getElementById('resource-name').value = '';
    document.getElementById('resource-type').value = '';
    document.getElementById('resource-link').value = '';
    
    updateResourceCount();
}

function addResourceToDOM(resource) {
    const resourcesList = document.getElementById('resources-list');
    const resourceItem = document.createElement('div');
    resourceItem.className = 'resource-item';
    resourceItem.dataset.id = resource.id;
    resourceItem.dataset.type = resource.type.toLowerCase();
    
    resourceItem.innerHTML = `
        <div class="resource-info">
            <div class="resource-name">${resource.name}</div>
            <div class="resource-meta">
                <span class="resource-type">${resource.type}</span>
                ${resource.link !== '#' ? `· <a href="${resource.link}" class="resource-link" target="_blank">Link</a>` : ''}
            </div>
        </div>
        <div class="resource-actions">
            <button class="delete-resource"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    resourceItem.querySelector('.delete-resource').addEventListener('click', () => deleteResource(resource.id));
    resourcesList.appendChild(resourceItem);
}

function deleteResource(resourceId) {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    const resources = getResources().filter(resource => resource.id != resourceId);
    localStorage.setItem('jeeProdigyResources', JSON.stringify(resources));
    document.querySelector(`.resource-item[data-id="${resourceId}"]`)?.
