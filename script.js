// Select elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" class="toggle-task" />
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;

    taskList.appendChild(li);
  });
  saveTasks();
}

// Save to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text !== "") {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    renderTasks();
  }
});

// Toggle task completion
taskList.addEventListener("change", e => {
  if (e.target.classList.contains("toggle-task")) {
    const index = e.target.dataset.index;
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
  }
});

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Edit task
function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText.trim();
    renderTasks();
  }
}

// Filter tasks
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Initial render
renderTasks();
