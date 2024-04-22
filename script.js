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
  li.textContent = task;
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  checkbox.addEventListener("change", function () {
    updateTaskStatus(index, this.checked);
  });
  li.prepend(checkbox);
  var removeButton = document.createElement("button");
  removeButton.innerHTML = "&times;"; // Red cross symbol
  removeButton.classList.add("remove-button");
  removeButton.onclick = function () {
    removeTask(index);
  };
  li.appendChild(removeButton);
  li.addEventListener("click", function () {
    selectTask(this);
  }); // Add event listener for clicking on task
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

function selectTask(taskElement) {
  // Toggle selected class for the task element
  taskElement.classList.toggle("selected");
}
