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
  return makeElement({
    tag: "li",
    data: { index },
    children: [
      makeElement({
        tag: "input",
        attributes: {
          type: "checkbox",
          checked: completed,
        },
        events: {
          change: function () {
            updateTaskStatus(index, this.checked);
          }
        }
      }),
      makeElement({
        tag: "span",
        text: task,
        classes: ["task-text"],
        events: {
          click: function () {
            editTask(this);
          }
        }
      }),
      makeElement({
        tag: "button",
        html: "&times;",
        classes: ["remove-button"],
        events: {
          click: function () {
            removeTask(index);
          }
        }
      })
    ]
  });
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
  let parent = taskElement.parentElement;

  var index = parent.dataset.index;
  var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  var taskInput = makeElement({
    tag: "input",
    type: "text",
    attributes: {
      value: tasks[index].task,
    },
    classes: ["task-input"],
  });

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

  taskInput.addEventListener("blur", function (e) {
    // Blur event should not trigger if Escape key was pressed
    setTimeout(function () {
      if (!escapePressed) {
        tasks[index].task = taskInput.value.trim();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
      }
    }, 0);
  });

  // replace taskElement with taskInput
  parent.replaceChild(taskInput, taskElement);

  taskInput.focus();
}
