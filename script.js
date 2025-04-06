// Daily Motivational Quotes (30 days)
const dailyQuotes = [
    {
        quote: "Success is the sum of small efforts repeated day in and day out.",
        author: "Robert Collier"
    },
    {
        quote: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        quote: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    },
    {
        quote: "The expert in anything was once a beginner.",
        author: "Helen Hayes"
    },
    {
        quote: "Your limitation—it's only your imagination.",
        author: "Unknown"
    },
    {
        quote: "Push yourself, because no one else is going to do it for you.",
        author: "Unknown"
    },
    {
        quote: "Great things never come from comfort zones.",
        author: "Unknown"
    },
    {
        quote: "Dream it. Wish it. Do it.",
        author: "Unknown"
    },
    {
        quote: "Success doesn't just find you. You have to go out and get it.",
        author: "Unknown"
    },
    {
        quote: "The harder you work for something, the greater you'll feel when you achieve it.",
        author: "Unknown"
    },
    {
        quote: "Dream bigger. Do bigger.",
        author: "Unknown"
    },
    {
        quote: "Don't stop when you're tired. Stop when you're done.",
        author: "Unknown"
    },
    {
        quote: "Wake up with determination. Go to bed with satisfaction.",
        author: "Unknown"
    },
    {
        quote: "Do something today that your future self will thank you for.",
        author: "Unknown"
    },
    {
        quote: "Little things make big days.",
        author: "Unknown"
    },
    {
        quote: "It's going to be hard, but hard does not mean impossible.",
        author: "Unknown"
    },
    {
        quote: "Don't wait for opportunity. Create it.",
        author: "Unknown"
    },
    {
        quote: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
        author: "Unknown"
    },
    {
        quote: "The key to success is to focus on goals, not obstacles.",
        author: "Unknown"
    },
    {
        quote: "Dream it. Believe it. Build it.",
        author: "Unknown"
    },
    {
        quote: "Strive for progress, not perfection.",
        author: "Unknown"
    },
    {
        quote: "The distance between your dreams and reality is called action.",
        author: "Unknown"
    },
    {
        quote: "Be so good they can't ignore you.",
        author: "Steve Martin"
    },
    {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        quote: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.",
        author: "Pelé"
    },
    {
        quote: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        quote: "Don't limit your challenges. Challenge your limits.",
        author: "Unknown"
    },
    {
        quote: "Every day is a chance to be better than yesterday.",
        author: "Unknown"
    },
    {
        quote: "Small steps every day lead to big results.",
        author: "Unknown"
    },
    {
        quote: "You don't have to be great to start, but you have to start to be great.",
        author: "Zig Ziglar"
    }
];

// Initialize Firebase (you'll need to add your config)
// For now, we'll use localStorage as a fallback

// DOM Elements
const quoteElement = document.getElementById('daily-quote');
const authorElement = document.getElementById('quote-author');
const tabLinks = document.querySelectorAll('nav ul li');
const tabContents = document.querySelectorAll('.tab-content');

// Set daily quote
function setDailyQuote() {
    const today = new Date().getDate(); // Get day of month (1-31)
    const quoteIndex = (today - 1) % dailyQuotes.length; // Ensure we stay within array bounds
    quoteElement.textContent = dailyQuotes[quoteIndex].quote;
    authorElement.textContent = dailyQuotes[quoteIndex].author;
}

// Tab switching functionality
tabLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all tabs and links
        tabLinks.forEach(item => item.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and link
        link.classList.add('active');
        const tabId = link.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Initialize the app
function initApp() {
    setDailyQuote();
    
    // Initialize all modules
    initTimetable();
    initTodoList();
    initQuestionPractice();
    initDiary();
    initRewards();
    initPunishments();
    initResources();
    initNotificationModal();
}

// Timetable Module
function initTimetable() {
    const addSlotBtn = document.getElementById('add-time-slot');
    const clearTimetableBtn = document.getElementById('clear-timetable');
    const addSlotModal = document.getElementById('add-slot-modal');
    const closeModal = document.querySelector('.close-modal');
    const timeSlotForm = document.getElementById('time-slot-form');
    const timetableBody = document.getElementById('timetable-body');
    
    // Load timetable from localStorage
    loadTimetable();
    
    // Event listeners
    addSlotBtn.addEventListener('click', () => {
        addSlotModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', () => {
        addSlotModal.style.display = 'none';
    });
    
    clearTimetableBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your entire timetable?')) {
            localStorage.removeItem('jeeProdigyTimetable');
            timetableBody.innerHTML = '';
            showNotification('Timetable Cleared', 'Your timetable has been cleared successfully.');
        }
    });
    
    timeSlotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;
        const day = document.getElementById('day').value;
        const activity = document.getElementById('activity').value;
        
        addTimeSlot(startTime, endTime, day, activity);
        
        // Reset form and close modal
        timeSlotForm.reset();
        addSlotModal.style.display = 'none';
    });
    
    // Function to add a new time slot
    function addTimeSlot(startTime, endTime, day, activity) {
        // Create time slot element
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.innerHTML = `
            <p class="time">${formatTime(startTime)} - ${formatTime(endTime)}</p>
            <p class="activity">${activity}</p>
        `;
        
        // Find the correct cell to append to
        const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(day) + 1;
        const timeSlots = Array.from(document.querySelectorAll('.timetable-body div'));
        
        // Find if this time slot already exists for this day
        let existingSlot = false;
        for (let i = 0; i < timeSlots.length; i += 8) { // 8 columns (time + 7 days)
            const timeCell = timeSlots[i];
            if (timeCell.textContent === `${formatTime(startTime)} - ${formatTime(endTime)}`) {
                const dayCell = timeSlots[i + dayIndex];
                if (dayCell.querySelector('.time-slot')) {
                    existingSlot = true;
                    if (confirm('There is already an activity scheduled for this time. Replace it?')) {
                        dayCell.innerHTML = '';
                        dayCell.appendChild(timeSlot);
                    }
                } else {
                    dayCell.appendChild(timeSlot);
                }
                break;
            }
        }
        
        // If time slot doesn't exist, create new row
        if (!existingSlot) {
            const newRow = document.createElement('div');
            newRow.textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;
            
            // Create cells for each day
            for (let i = 0; i < 7; i++) {
                const dayCell = document.createElement('div');
                if (i === dayIndex - 1) {
                    dayCell.appendChild(timeSlot);
                }
                newRow.appendChild(dayCell);
            }
            
            // Insert new row in the correct time order
            let inserted = false;
            const timeRows = Array.from(document.querySelectorAll('.timetable-body div:nth-child(8n+1)'));
            for (let i = 0; i < timeRows.length; i++) {
                const rowTime = timeRows[i].textContent.split(' - ')[0];
                if (compareTimes(formatTime(startTime), rowTime) < 0) {
                    timeRows[i].parentNode.before(newRow);
                    inserted = true;
                    break;
                }
            }
            
            if (!inserted) {
                timetableBody.appendChild(newRow);
            }
        }
        
        // Save timetable to localStorage
        saveTimetable();
        showNotification('Time Slot Added', 'Your new time slot has been added to the timetable.');
    }
    
    // Helper function to format time (HH:MM) to 12-hour format
    function formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }
    
    // Helper function to compare two times
    function compareTimes(time1, time2) {
        const [time1Str, period1] = time1.split(' ');
        const [time2Str, period2] = time2.split(' ');
        
        const [h1, m1] = time1Str.split(':').map(Number);
        const [h2, m2] = time2Str.split(':').map(Number);
        
        // Convert to 24-hour format for comparison
        const hour1 = period1 === 'PM' && h1 !== 12 ? h1 + 12 : (period1 === 'AM' && h1 === 12 ? 0 : h1);
        const hour2 = period2 === 'PM' && h2 !== 12 ? h2 + 12 : (period2 === 'AM' && h2 === 12 ? 0 : h2);
        
        if (hour1 !== hour2) return hour1 - hour2;
        return m1 - m2;
    }
    
    // Save timetable to localStorage
    function saveTimetable() {
        const timetableData = [];
        const timeRows = Array.from(document.querySelectorAll('.timetable-body > div'));
        
        timeRows.forEach(row => {
            const timeText = row.firstChild.textContent;
            if (timeText.includes(' - ')) {
                const [startTime, endTime] = timeText.split(' - ').map(t => t.trim());
                const days = Array.from(row.children).slice(1); // Skip the time cell
                
                days.forEach((dayCell, index) => {
                    const activitySlot = dayCell.querySelector('.time-slot');
                    if (activitySlot) {
                        const activity = activitySlot.querySelector('.activity').textContent;
                        const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index];
                        
                        timetableData.push({
                            startTime,
                            endTime,
                            day,
                            activity
                        });
                    }
                });
            }
        });
        
        localStorage.setItem('jeeProdigyTimetable', JSON.stringify(timetableData));
    }
    
    // Load timetable from localStorage
    function loadTimetable() {
        const savedTimetable = localStorage.getItem('jeeProdigyTimetable');
        if (savedTimetable) {
            const timetableData = JSON.parse(savedTimetable);
            
            // Clear existing timetable
            timetableBody.innerHTML = '';
            
            // Group by time slots
            const timeSlotMap = new Map();
            
            timetableData.forEach(slot => {
                const timeKey = `${slot.startTime} - ${slot.endTime}`;
                if (!timeSlotMap.has(timeKey)) {
                    timeSlotMap.set(timeKey, {});
                }
                timeSlotMap.get(timeKey)[slot.day] = slot.activity;
            });
            
            // Create rows for each time slot
            timeSlotMap.forEach((dayActivities, timeRange) => {
                const row = document.createElement('div');
                row.textContent = timeRange;
                
                // Create cells for each day
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
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
    }
}

// To-Do List Module
function initTodoList() {
    const todoInput = document.getElementById('new-task');
    const timeInput = document.getElementById('task-time');
    const addTaskBtn = document.getElementById('add-task');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');
    const pendingTasksSpan = document.getElementById('pending-tasks');
    
    // Load tasks from localStorage
    loadTasks();
    updateTaskStats();
    
    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterTasks(button.getAttribute('data-filter'));
        });
    });
    
    // Function to add a new task
    function addTask() {
        const taskText = todoInput.value.trim();
        const taskTime = timeInput.value;
        
        if (taskText === '') {
            showNotification('Empty Task', 'Please enter a task description.');
            return;
        }
        
        const taskId = Date.now();
        const task = {
            id: taskId,
            text: taskText,
            time: taskTime,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Add to DOM
        addTaskToDOM(task);
        
        // Save to localStorage
        saveTask(task);
        
        // Clear inputs
        todoInput.value = '';
        timeInput.value = '';
        
        // Update stats
        updateTaskStats();
    }
    
    // Function to add task to DOM
    function addTaskToDOM(task) {
        const taskItem = document.createElement('div');
        taskItem.className = `todo-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;
        
        taskItem.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="todo-text">${task.text}</div>
            <div class="todo-time">${task.time || 'No time set'}</div>
            <div class="todo-actions">
                <button class="edit-task"><i class="fas fa-edit"></i></button>
                <button class="delete-task"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Add event listeners to new task
        const checkbox = taskItem.querySelector('.todo-checkbox');
        const editBtn = taskItem.querySelector('.edit-task');
        const deleteBtn = taskItem.querySelector('.delete-task');
        
        checkbox.addEventListener('change', () => toggleTaskComplete(task.id, checkbox.checked));
        editBtn.addEventListener('click', () => editTask(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        todoList.appendChild(taskItem);
    }
    
    // Function to toggle task completion status
    function toggleTaskComplete(taskId, isCompleted) {
        const tasks = getTasks();
        const taskIndex = tasks.findIndex(task => task.id == taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = isCompleted;
            localStorage.setItem('jeeProdigyTasks', JSON.stringify(tasks));
            
            const taskItem = document.querySelector(`.todo-item[data-id="${taskId}"]`);
            if (taskItem) {
                taskItem.classList.toggle('completed', isCompleted);
                
                if (isCompleted) {
                    showNotification('Task Completed', 'Great job! You completed a task.');
                    // Random chance to earn a reward
                    if (Math.random() > 0.7) {
                        giveRandomReward();
                    }
                }
            }
            
            updateTaskStats();
        }
    }
    
    // Function to edit a task
    function editTask(taskId) {
        const tasks = getTasks();
        const task = tasks.find(t => t.id == taskId);
        
        if (task) {
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
    }
    
    // Function to delete a task
    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            const tasks = getTasks().filter(task => task.id != taskId);
            localStorage.setItem('jeeProdigyTasks', JSON.stringify(tasks));
            
            const taskItem = document.querySelector(`.todo-item[data-id="${taskId}"]`);
            if (taskItem) {
                taskItem.remove();
                
                // Check if task was pending and apply punishment
                if (!taskItem.classList.contains('completed')) {
                    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                    if (activeFilter === 'all' || activeFilter === 'pending') {
                        showNotification('Task Deleted', 'You deleted a pending task. Stay disciplined!');
                        // Random chance to receive punishment
                        if (Math.random() > 0.5) {
                            giveRandomPunishment();
                        }
                    }
                }
            }
            
            updateTaskStats();
        }
    }
    
    // Function to filter tasks
    function filterTasks(filter) {
    const tasks = getTasks();
        todoList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (filter === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        filteredTasks.forEach(task => addTaskToDOM(task));
    }
    
    // Function to update task statistics
    function updateTaskStats() {
        const tasks = getTasks();
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        totalTasksSpan.textContent = total;
        completedTasksSpan.textContent = completed;
        pendingTasksSpan.textContent = pending;
    }
    
    // Helper function to get all tasks
    function getTasks() {
        const tasksJSON = localStorage.getItem('jeeProdigyTasks');
        return tasksJSON ? JSON.parse(tasksJSON) : [];
    }
    
    // Helper function to save a task
    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('jeeProdigyTasks', JSON.stringify(tasks));
    }
    
    // Helper function to load tasks
    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => addTaskToDOM(task));
    }
}

// Question Practice Module
function initQuestionPractice() {
    const practiceForm = document.getElementById('question-practice-form');
    const questionSession = document.getElementById('question-session');
    const sessionComplete = document.getElementById('session-complete');
    const startTimerBtn = document.getElementById('start-timer');
    const stopTimerBtn = document.getElementById('stop-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    const questionTimer = document.getElementById('question-timer');
    const sessionTime = document.getElementById('session-time');
    const submitResultsBtn = document.getElementById('submit-results');
    const historyTable = document.getElementById('question-history-table').querySelector('tbody');
    
    let currentSession = null;
    let currentQuestion = 0;
    let questionTimes = [];
    let timerInterval = null;
    let startTime = null;
    let elapsedTime = 0;

 // Load practice history
    loadPracticeHistory();
    
    // Event listeners
    practiceForm.addEventListener('submit', startPracticeSession);
    startTimerBtn.addEventListener('click', startTimer);
    stopTimerBtn.addEventListener('click', stopTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    submitResultsBtn.addEventListener('click', submitResults);
    
    // Function to start a new practice session
    function startPracticeSession(e) {
        e.preventDefault();
        
        const date = document.getElementById('practice-date').value;
        const chapter = document.getElementById('chapter').value;
        const totalQuestions = parseInt(document.getElementById('total-questions').value);
        const allottedTime = parseInt(document.getElementById('allotted-time').value);
        
        currentSession = {
            date,
            chapter,
            totalQuestions,
            allottedTime,
            attemptedQuestions: 0,
            correctQuestions: 0,
            questionTimes: [],
            completed: false
        };
        
        currentQuestion = 0;
        questionTimes = [];

      // Update UI
        document.getElementById('current-chapter').textContent = chapter;
        document.getElementById('session-questions').textContent = '0';
        document.getElementById('total-session-questions').textContent = totalQuestions;
        document.getElementById('attempted-questions').textContent = '0';
        document.getElementById('total-questions-display').textContent = totalQuestions;
        document.getElementById('correct-questions').value = '';
        
        // Show session section
        practiceForm.reset();
        questionSession.style.display = 'block';
        sessionComplete.style.display = 'none';
        
        // Reset timer
        resetTimer();
    }
    
    // Function to start the timer
    function startTimer() {
        if (timerInterval) return;
        
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 1000);
        startTimerBtn.disabled = true;
        stopTimerBtn.disabled = false;
    }
    
    // Function to update the timer display
    function updateTimer() {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime;

        const hours = Math.floor(elapsedTime / 3600000);
        const minutes = Math.floor((elapsedTime % 3600000) / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        
        questionTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update session time
        const totalElapsed = questionTimes.reduce((sum, time) => sum + time, 0) + elapsedTime;
        const sessionHours = Math.floor(totalElapsed / 3600000);
        const sessionMinutes = Math.floor((totalElapsed % 3600000) / 60000);
        const sessionSeconds = Math.floor((totalElapsed % 60000) / 1000);
        
        sessionTime.textContent = `${sessionHours.toString().padStart(2, '0')}:${sessionMinutes.toString().padStart(2, '0')}:${sessionSeconds.toString().padStart(2, '0')}`;
    }
    
    // Function to stop the timer (move to next question)
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
            // Reset for next question
            resetTimer();
            startTimer();
        }
    }
    
    // Function to reset the timer
    function resetTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        elapsedTime = 0;
        questionTimer.textContent = '00:00:00';
        startTimerBtn.disabled = false;
        stopTimerBtn.disabled = true;
    }
    
    // Function called when all questions are attempted
    function completeSession() {
        currentSession.attemptedQuestions = currentQuestion;
        currentSession.questionTimes = questionTimes;
        
        // Show results form
        sessionComplete.style.display = 'block';
    }
    
    // Function to submit results
    function submitResults() {
        const correctQuestions = parseInt(document.getElementById('correct-questions').value);

    if (isNaN(correctQuestions) || correctQuestions < 0 || correctQuestions > currentSession.attemptedQuestions) {
            showNotification('Invalid Input', 'Please enter a valid number of correct questions.');
            return;
        }
        
        currentSession.correctQuestions = correctQuestions;
        currentSession.completed = true;
        
        // Calculate average time per question
        const totalTime = questionTimes.reduce((sum, time) => sum + time, 0);
        const avgTime = totalTime / questionTimes.length;
        
        // Save session to history
        savePracticeSession({
            date: currentSession.date,
            chapter: currentSession.chapter,
            totalQuestions: currentSession.totalQuestions,
            attemptedQuestions: currentSession.attemptedQuestions,
            correctQuestions: currentSession.correctQuestions,
            avgTime: avgTime
        });
        
        // Check performance and give rewards/punishments
        const completionRatio = currentSession.attemptedQuestions / currentSession.totalQuestions;
        const accuracy = currentSession.correctQuestions / currentSession.attemptedQuestions;
        
        if (completionRatio >= 0.5) {
            showNotification('Good Job!', `You completed ${Math.round(completionRatio * 100)}% of your target.`);
            giveRandomReward();
            if (accuracy >= 0.5) {
                showNotification('Excellent Accuracy!', `You got ${Math.round(accuracy * 100)}% of questions correct.`);
                giveRandomReward('big');
            }
        } else {
            showNotification('Keep Trying', `You only completed ${Math.round(completionRatio * 100)}% of your target. Stay disciplined!`);
            giveRandomPunishment();
        }
        
        // Reset session
        questionSession.style.display = 'none';
        currentSession = null;
    }
    
    // Function to save practice session to history
    function savePracticeSession(session) {
        const history = getPracticeHistory();
        history.push(session);
        localStorage.setItem('jeeProdigyQuestionHistory', JSON.stringify(history));
        loadPracticeHistory();
    }
    // Function to load practice history
    function loadPracticeHistory() {
        const history = getPracticeHistory();
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
    
    // Helper function to get practice history
    function getPracticeHistory() {
        const historyJSON = localStorage.getItem('jeeProdigyQuestionHistory');
        return historyJSON ? JSON.parse(historyJSON) : [];
    }
}

// Diary Module
function initDiary() {
    const diaryDate = document.getElementById('diary-date');
    const loadDiaryBtn = document.getElementById('load-diary');
    const diaryText = document.getElementById('diary-text');
    const saveDiaryBtn = document.getElementById('save-diary');
    const clearDiaryBtn = document.getElementById('clear-diary');
    const diaryHistoryList = document.getElementById('diary-history-list');
    
    // Set default date to today
    diaryDate.valueAsDate = new Date();

    // Load today's diary if exists
    loadDiaryEntry(new Date().toISOString().split('T')[0]);
    
    // Load diary history
    loadDiaryHistory();
    
    // Event listeners
    loadDiaryBtn.addEventListener('click', () => {
        loadDiaryEntry(diaryDate.value);
    });
    
    saveDiaryBtn.addEventListener('click', saveDiaryEntry);
    clearDiaryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear this diary entry?')) {
            diaryText.value = '';
        }
    });
    
    // Function to load a diary entry
    function loadDiaryEntry(date) {
        const entries = getDiaryEntries();
        const entry = entries.find(e => e.date === date);
        
        diaryText.value = entry ? entry.text : '';
    }
    
    // Function to save a diary entry
    function saveDiaryEntry() {
        const date = diaryDate.value;
        const text = diaryText.value.trim();
        
        if (text === '') {
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
    
    // Function to load diary history
    function loadDiaryHistory() {
        const entries = getDiaryEntries();
        diaryHistoryList.innerHTML = '';
        
        // Sort by date (newest first)
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        entries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'diary-entry-item';
            entryElement.innerHTML = `
                <div class="diary-entry-date">${formatDate(entry.date)}</div>
                <div class="diary-entry-text">${entry.text.substring(0, 100)}${entry.text.length > 100 ? '...' : ''}</div>
            `;

            entryElement.addEventListener('click', () => {
                diaryDate.value = entry.date;
                loadDiaryEntry(entry.date);
                // Switch to diary tab
                document.querySelector(`nav ul li[data-tab="diary"]`).click();
            });
            
            diaryHistoryList.appendChild(entryElement);
        });
    }
    
    // Helper function to format date
    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    }
    
    // Helper function to get diary entries
    function getDiaryEntries() {
        const entriesJSON = localStorage.getItem('jeeProdigyDiaryEntries');
        return entriesJSON ? JSON.parse(entriesJSON) : [];
    }
}

// Rewards Module
function initRewards() {
    const newRewardInput = document.getElementById('new-reward');
    const addRewardBtn = document.getElementById('add-reward');
    const rewardsList = document.getElementById('rewards-list');
    const earnedRewardsList = document.getElementById('earned-rewards-list');

    // Load rewards
    loadRewards();
    loadEarnedRewards();
    
    // Event listeners
    addRewardBtn.addEventListener('click', addReward);
    newRewardInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addReward();
    });
    
    // Function to add a new reward
    function addReward() {
        const rewardText = newRewardInput.value.trim();
        
        if (rewardText === '') {
            showNotification('Empty Reward', 'Please enter a reward description.');
            return;
        }
        
        const reward = {
            id: Date.now(),
            text: rewardText
        };
        
        // Add to DOM
        addRewardToDOM(reward);
        
        // Save to localStorage
        saveReward(reward);
        
        // Clear input
        newRewardInput.value = '';
    }

     // Function to add reward to DOM
    function addRewardToDOM(reward) {
        const rewardItem = document.createElement('div');
        rewardItem.className = 'reward-item';
        rewardItem.dataset.id = reward.id;
        
        rewardItem.innerHTML = `
            <div class="reward-text">${reward.text}</div>
            <div class="reward-actions">
                <button class="delete-reward"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Add event listeners
        const deleteBtn = rewardItem.querySelector('.delete-reward');
        deleteBtn.addEventListener('click', () => deleteReward(reward.id));
        
        rewardsList.appendChild(rewardItem);
    }
    
    // Function to delete a reward
    function deleteReward(rewardId) {
        if (confirm('Are you sure you want to delete this reward?')) {
            const rewards = getRewards().filter(reward => reward.id != rewardId);
            localStorage.setItem('jeeProdigyRewards', JSON.stringify(rewards));
            
            const rewardItem = document.querySelector(`.reward-item[data-id="${rewardId}"]`);
            if (rewardItem) {
                rewardItem.remove();
            }
        }
    }
     // Function to give a random reward
    function giveRandomReward(size = 'normal') {
        const rewards = getRewards();
        if (rewards.length === 0) {
            showNotification('No Rewards', 'You have no rewards set up. Add some in the Rewards section!');
            return;
        }
        
        // Filter rewards by size if we had that property (for future enhancement)
        const eligibleRewards = rewards; // In future, could filter by size
        
        const randomIndex = Math.floor(Math.random() * eligibleRewards.length);
        const reward = eligibleRewards[randomIndex];
        
        // Add to earned rewards
        const earnedReward = {
            id: Date.now(),
            rewardId: reward.id,
            text: reward.text,
            date: new Date().toISOString(),
            size: size
        };
        
        const earnedRewards = getEarnedRewards();
        earnedRewards.push(earnedReward);
        localStorage.setItem('jeeProdigyEarnedRewards', JSON.stringify(earnedRewards));
        
        // Show notification
        const sizeAdjective = size === 'big' ? 'a BIG' : 'a';
        showNotification('Reward Earned!', `You've earned ${sizeAdjective} reward: ${reward.text}`);

     // Update earned rewards list
        loadEarnedRewards();
    }
    
    // Function to load rewards
    function loadRewards() {
        const rewards = getRewards();
        rewardsList.innerHTML = '';
        rewards.forEach(reward => addRewardToDOM(reward));
    }
    
    // Function to load earned rewards
    function loadEarnedRewards() {
        const earnedRewards = getEarnedRewards();
        earnedRewardsList.innerHTML = '';
        
        // Sort by date (newest first)
        earnedRewards.sort((a, b) => new Date(b.date) - new Date(a.date));
        
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
            
            earnedRewardsList.appendChild(rewardItem);
        });
    }
     // Helper function to get rewards
    function getRewards() {
        const rewardsJSON = localStorage.getItem('jeeProdigyRewards');
        return rewardsJSON ? JSON.parse(rewardsJSON) : [];
    }
    
    // Helper function to save a reward
    function saveReward(reward) {
        const rewards = getRewards();
        rewards.push(reward);
        localStorage.setItem('jeeProdigyRewards', JSON.stringify(rewards));
    }
    
    // Helper function to get earned rewards
    function getEarnedRewards() {
        const earnedJSON = localStorage.getItem('jeeProdigyEarnedRewards');
        return earnedJSON ? JSON.parse(earnedJSON) : [];
    }
}

// Punishments Module
function initPunishments() {
    const newPunishmentInput = document.getElementById('new-punishment');
    const addPunishmentBtn = document.getElementById('add-punishment');
    const punishmentsList = document.getElementById('punishments-list');
    const receivedPunishmentsList = document.getElementById('received-punishments-list');
    
    // Load punishments
    loadPunishments();
    loadReceivedPunishments();
    
     // Event listeners
    addPunishmentBtn.addEventListener('click', addPunishment);
    newPunishmentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPunishment();
    });
    
    // Function to add a new punishment
    function addPunishment() {
        const punishmentText = newPunishmentInput.value.trim();
        
        if (punishmentText === '') {
            showNotification('Empty Punishment', 'Please enter a punishment description.');
            return;
        }
        
        const punishment = {
            id: Date.now(),
            text: punishmentText
        };
        
        // Add to DOM
        addPunishmentToDOM(punishment);
        
        // Save to localStorage
        savePunishment(punishment);
        
        // Clear input
        newPunishmentInput.value = '';
    }
    
    // Function to add punishment to DOM
    function addPunishmentToDOM(punishment) {
        const punishmentItem = document.createElement('div');
        punishmentItem.className = 'punishment-item';
        punishmentItem.dataset.id = punishment.id;

    punishmentItem.innerHTML = `
            <div class="punishment-text">${punishment.text}</div>
            <div class="punishment-actions">
                <button class="delete-punishment"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Add event listeners
        const deleteBtn = punishmentItem.querySelector('.delete-punishment');
        deleteBtn.addEventListener('click', () => deletePunishment(punishment.id));
        
        punishmentsList.appendChild(punishmentItem);
    }
    
    // Function to delete a punishment
    function deletePunishment(punishmentId) {
        if (confirm('Are you sure you want to delete this punishment?')) {
            const punishments = getPunishments().filter(punishment => punishment.id != punishmentId);
            localStorage.setItem('jeeProdigyPunishments', JSON.stringify(punishments));
            
            const punishmentItem = document.querySelector(`.punishment-item[data-id="${punishmentId}"]`);
            if (punishmentItem) {
                punishmentItem.remove();
            }
        }
    }

        // Function to give a random punishment
    function giveRandomPunishment() {
        const punishments = getPunishments();
        if (punishments.length === 0) {
            showNotification('No Punishments', 'You have no punishments set up. Add some in the Punishments section!');
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * punishments.length);
        const punishment = punishments[randomIndex];
        
        // Add to received punishments
        const receivedPunishment = {
            id: Date.now(),
            punishmentId: punishment.id,
            text: punishment.text,
            date: new Date().toISOString()
        };
        
        const receivedPunishments = getReceivedPunishments();
        receivedPunishments.push(receivedPunishment);
        localStorage.setItem('jeeProdigyReceivedPunishments', JSON.stringify(receivedPunishments));
        
        // Show notification
        showNotification('Punishment Received', `You've received a punishment: ${punishment.text}`);
        
        // Update received punishments list
        loadReceivedPunishments();
    }

    
     // Function to load punishments
    function loadPunishments() {
        const punishments = getPunishments();
        punishmentsList.innerHTML = '';
        punishments.forEach(punishment => addPunishmentToDOM(punishment));
    }
    
    // Function to load received punishments
    function loadReceivedPunishments() {
        const receivedPunishments = getReceivedPunishments();
        receivedPunishmentsList.innerHTML = '';
        
        // Sort by date (newest first)
        receivedPunishments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        receivedPunishments.forEach(punishment => {
            const punishmentItem = document.createElement('div');
            punishmentItem.className = 'received-punishment-item';
            
            const date = new Date(punishment.date);
            const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            punishmentItem.innerHTML = `
                <div><strong>${punishment.text}</strong></div>
                <div>Received on: ${dateStr}</div>
            `;
            
            receivedPunishmentsList.appendChild(punishmentItem);
        });
    }

 // Helper function to get punishments
    function getPunishments() {
        const punishmentsJSON = localStorage.getItem('jeeProdigyPunishments');
        return punishmentsJSON ? JSON.parse(punishmentsJSON) : [];
    }
    
    // Helper function to save a punishment
    function savePunishment(punishment) {
        const punishments = getPunishments();
        punishments.push(punishment);
        localStorage.setItem('jeeProdigyPunishments', JSON.stringify(punishments));
    }
    
    // Helper function to get received punishments
    function getReceivedPunishments() {
        const receivedJSON = localStorage.getItem('jeeProdigyReceivedPunishments');
        return receivedJSON ? JSON.parse(receivedJSON) : [];
    }
}

// Resources Module
function initResources() {
    const resourceNameInput = document.getElementById('resource-name');
    const resourceTypeInput = document.getElementById('resource-type');
    const resourceLinkInput = document.getElementById('resource-link');
    const addResourceBtn = document.getElementById('add-resource');
    const resourcesList = document.getElementById('resources-list');
    const totalResourcesSpan = document.getElementById('total-resources');
    const resourceFilters = document.querySelectorAll('.resource-filter');
    
    // Load resources
    loadResources();
    
    // Event listeners
    addResourceBtn.addEventListener('click', addResource);
    resourceNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addResource();
    });
    
    resourceFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            resourceFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            filterResources(filter.getAttribute('data-filter'));
        });
    });
    
    // Function to add a new resource
    function addResource() {
        const name = resourceNameInput.value.trim();
        const type = resourceTypeInput.value.trim();
        const link = resourceLinkInput.value.trim();
        
        if (name === '') {
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
        
        // Add to DOM
        addResourceToDOM(resource);
        
        // Save to localStorage
        saveResource(resource);
        
        // Clear inputs
        resourceNameInput.value = '';
        resourceTypeInput.value = '';
        resourceLinkInput.value = '';
        
        // Update total count
        updateResourceCount();
    }
    
    // Function to add resource to DOM
    function addResourceToDOM(resource) {
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
        
        // Add event listeners
        const deleteBtn = resourceItem.querySelector('.delete-resource');
        deleteBtn.addEventListener('click', () => deleteResource(resource.id));
        
        resourcesList.appendChild(resourceItem);
    }
    
    // Function to delete a resource
    function deleteResource(resourceId) {
        if (confirm('Are you sure you want to delete this resource?')) {
            const resources = getResources().filter(resource => resource.id != resourceId);
            localStorage.setItem('jeeProdigyResources', JSON.stringify(resources));
            
            const resourceItem = document.querySelector(`.resource-item[data-id="${resourceId}"]`);
            if (resourceItem) {
                resourceItem.remove();
                updateResourceCount();
            }
        }
    }
    
     // Function to filter resources
    function filterResources(filter) {
        const resourceItems = document.querySelectorAll('.resource-item');
        
        resourceItems.forEach(item => {
            if (filter === 'all' || item.dataset.type.includes(filter)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Function to update resource count
    function updateResourceCount() {
        const resources = getResources();
        totalResourcesSpan.textContent = resources.length;
    }
    
    // Function to load resources
    function loadResources() {
        const resources = getResources();
        resourcesList.innerHTML = '';
        resources.forEach(resource => addResourceToDOM(resource));
        updateResourceCount();
    }
    
    // Helper function to get resources
    function getResources() {
        const resourcesJSON = localStorage.getItem('jeeProdigyResources');
        return resourcesJSON ? JSON.parse(resourcesJSON) : [];
    }

      // Helper function to save a resource
    function saveResource(resource) {
        const resources = getResources();
        resources.push(resource);
        localStorage.setItem('jeeProdigyResources', JSON.stringify(resources));
    }
}

// Notification Modal
function initNotificationModal() {
    const notificationModal = document.getElementById('notification-modal');
    const closeNotification = document.querySelector('.close-notification');
    const notificationOk = document.getElementById('notification-ok');
    
    // Close modal when clicking X or OK button
    closeNotification.addEventListener('click', () => {
        notificationModal.style.display = 'none';
    });
    
    notificationOk.addEventListener('click', () => {
        notificationModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === notificationModal) {
            notificationModal.style.display = 'none';
        }
    });
}

// Show notification function (can be called from anywhere)
function showNotification(title, message) {
    const notificationModal = document.getElementById('notification-modal');
    const notificationTitle = document.getElementById('notification-title');
    const notificationMessage = document.getElementById('notification-message');
    
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    notificationModal.style.display = 'flex';
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

                    
