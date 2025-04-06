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
    
    
