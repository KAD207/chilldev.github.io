// define localStorage
const STORAGE_KEY = 'todotask.tasks.v1';

// define constants
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filters = document.querySelectorAll('.filter');
const clearCompletedBtn = document.getElementById('Clear-completed');
const countEl = document.getElementById('count');

// tasks === array
let tasks = [];
let currentFilter = 'all';

// Unique ID generator (Tạo ra mọi task khác nhau)
function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

// Save + Load (Chuyển Object/Array -> JSON String)
function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
// (JSON String -> Object)
function load() {
    tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

// Update task counter
function updateCount() {
    const left = tasks.filter(t => !t.completed).length;
    countEl.textContent = `${left} việc còn lại`;
}

// Render tasks
function render() {
    const filtered = tasks.filter(t => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return !t.completed;
        return t.completed;
    });

    // Date and Time display
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    }

    // Displaying tasks
    taskList.innerHTML = filtered
    .map(
        t => `
        <li class="task ${t.completed ? 'task-completed' : ''} ${t.priority}" data-id="${t.id}">
            <label>
                <input class="toggle" type="checkbox" ${t.completed ? 'checked' : ''}/>
                <span class="task-text">${t.text}</span>
            </label>

            ${t.date ? `<span class="date">📅 ${formatDate(t.date)}</span>` : ''}

            <div class="task-actions">
                <button class="edit">✎</button>
                <button class="delete">🗑</button>
            </div>
        </li>`
    )
    .join('');

    updateCount();
}

// Add task
function addTask(text, date, priority) {
    tasks.unshift({
        id: uid(),
        text,
        date,
        priority,
        completed: false
    });
    save();
    render();
}

// Form submit
taskForm.addEventListener('submit', e => {
    e.preventDefault();

    const text = taskInput.value.trim();
    const date = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;

    if (text) {
        addTask(text, date, priority);
        taskInput.value = '';
        document.getElementById('task-date').value = '';
        document.getElementById('task-priority').value = '';
    }
});

// Toggle complete
function toggleTask(id) {
    const t = tasks.find(x => x.id === id);
    t.completed = !t.completed;
    save();
    render();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(x => x.id !== id);
    save();
    render();
}

// Edit task text
function updateTaskText(id, newText) {
    const t = tasks.find(x => x.id === id);
    t.text = newText;
    save();
    render();
}

// Clear completed tasks
function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    save();
    render();
}

// Set filter
function setFilter(name) {
    currentFilter = name;
    filters.forEach(b => b.classList.toggle('active', b.dataset.filter === name));
    render();
}

// Inline edit (sẽ tập trung vào ô đó để edit nội dung task)
function startEdit(li) {
    const id = li.dataset.id;
    const task = tasks.find(t => t.id === id);

    const span = li.querySelector('.task-text');
    const input = document.createElement('input');

    input.type = 'text';
    input.value = task.text;
    input.className = 'edit-input';

    span.replaceWith(input);
    input.focus();

    input.addEventListener('blur', () => {
        updateTaskText(id, input.value.trim());
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') input.blur();
    });
}

// Task actions
taskList.addEventListener('click', e => {
    const li = e.target.closest('.task');
    if (!li) return;

    const id = li.dataset.id;

    if (e.target.matches('.toggle')) toggleTask(id);
    if (e.target.matches('.delete')) deleteTask(id);
    if (e.target.matches('.edit')) startEdit(li);
});

// Filter buttons
filters.forEach(btn =>
    btn.addEventListener('click', () => setFilter(btn.dataset.filter))
);

// Clear button
clearCompletedBtn.addEventListener('click', clearCompleted);

// Themes
const btnDark = document.getElementById("btn-dark");
const btnLight = document.getElementById("btn-light");

let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', null)
}

// check to see if darkmode is active
if(darkmode === "active") enableDarkmode()

themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})

// Initiate
load();
render();


