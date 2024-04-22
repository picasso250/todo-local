document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
  setupInputListener();
});

function loadTasks() {
  var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  var taskList = document.getElementById("taskList");

  taskList.innerHTML = "";
  tasks.forEach(function (taskObj, index) {
    var li = createTaskElement(taskObj.task, taskObj.completed, index);
    taskList.appendChild(li);
  });
}

function createTaskElement(task, completed, index) {
  var li = document.createElement("li");
  li.dataset.index = index;

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  checkbox.addEventListener("change", function () {
    updateTaskStatus(index, this.checked);
  });
  li.appendChild(checkbox);

  var taskText = document.createElement("span");
  taskText.textContent = task;
  taskText.classList.add("task-text");
  taskText.addEventListener("click", function () {
    editTask(this);
  });
  li.appendChild(taskText);

  var removeButton = document.createElement("button");
  removeButton.innerHTML = "&times;"; // Red cross symbol
  removeButton.classList.add("remove-button");
  removeButton.onclick = function () {
    removeTask(index);
  };
  li.appendChild(removeButton);

  return li;
}

function setupInputListener() {
  var input = document.getElementById("taskInput");
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });
}

function addTask() {
  var input = document.getElementById("taskInput");
  var task = input.value.trim();

  if (task !== "") {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ task: task, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    input.value = "";
    loadTasks();
  }
}

function removeTask(index) {
  var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function updateTaskStatus(index, completed) {
  var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks[index].completed = completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function editTask(taskElement) {
  var index = taskElement.parentElement.dataset.index;
  var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  var taskInput = document.createElement("input");
  taskInput.type = "text";
  taskInput.value = tasks[index].task;
  taskInput.classList.add("task-input");

  var escapePressed = false; // Flag to track if Escape key is pressed

  taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      tasks[index].task = taskInput.value.trim();
      localStorage.setItem("tasks", JSON.stringify(tasks));
      loadTasks();
    } else if (event.key === "Escape") {
      // If Escape key is pressed, cancel editing
      taskElement.textContent = tasks[index].task;
      escapePressed = true;
    }
  });

  taskInput.addEventListener("blur", function () {
    // Blur event should not trigger if Escape key was pressed
    setTimeout(function () {
      if (!escapePressed) {
        tasks[index].task = taskInput.value.trim();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
      }
    }, 0);
  });

  taskElement.textContent = "";
  taskElement.appendChild(taskInput);
  taskInput.focus();
}
