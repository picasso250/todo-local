
document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
  setupInputListener();
});

function loadTasks() {
  const tasks = storage.getTasks();
  const taskList = document.getElementById("taskList");

  taskList.innerHTML = "";
  tasks.forEach((taskObj, index) => {
    // 兼容性，旧版本的没有level
    if (taskObj.level === undefined) {
      taskObj.level = 0;
      storage.updateTask(index, taskObj);
    }
    const li = createTaskElement(taskObj, index);
    taskList.appendChild(li);
  });
}

function createTaskElement(task, index) {
  let attrs = {
    type: "checkbox",
  };
  if (task.completed) attrs['checked'] = true;
  return makeElement({
    tag: "li",
    data: { index },
    styles: { "padding-left": (task.level * 2) + "em" },
    children: [
      makeElement({
        tag: "button",
        text: "",
        classes: ["toggle-button"],
        events: {
          click: function () {
            toggleTasks(index);
          }
        }
      }),
      makeElement({
        tag: "input",
        attributes: attrs,
        events: {
          change: function () {
            updateTaskStatus(index, this.checked);
          }
        }
      }),
      makeElement({
        tag: "span",
        text: task.task,
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
function toggleTasks(index) {
  const tasks = storage.getTasks();
  const taskList = document.getElementById("taskList");
  const listItem = taskList.childNodes[index]; // 获取当前任务的li元素

  if (listItem.classList.contains('collapsed')) {
    // 展开任务
    expandTasks(index, taskList, listItem);
  } else {
    // 折叠任务
    collapseTasks(index, taskList, listItem);
  }
}

function expandTasks(index, taskList, listItem) {
  const tasks = storage.getTasks();
  listItem.classList.remove('collapsed'); // 移除折叠状态的类名
  const currentLevel = tasks[index].level; // 获取当前任务的级别

  // 遍历当前任务之后的任务
  for (let i = index + 1; i < tasks.length; i++) {
    const taskLevel = tasks[i].level; // 获取任务的级别

    // 如果任务的级别小于当前任务的级别，则停止展开
    if (taskLevel <= currentLevel) {
      break;
    }

    // 如果任务的级别大于当前任务的级别，则显示任务
    if (taskList.childNodes[i].classList.contains('hidden')) {
      taskList.childNodes[i].classList.remove('hidden');
    }
  }
}

function collapseTasks(index, taskList, listItem) {
  const tasks = storage.getTasks();
  listItem.classList.add('collapsed'); // 添加折叠状态的类名
  const currentLevel = tasks[index].level; // 获取当前任务的级别

  // 遍历当前任务之后的任务
  for (let i = index + 1; i < tasks.length; i++) {
    const taskLevel = tasks[i].level; // 获取任务的级别

    // 如果任务的级别小于等于当前任务的级别，则隐藏任务
    if (taskLevel <= currentLevel) {
      break;
    }

    taskList.childNodes[i].classList.add('hidden');
  }
}

function setupInputListener() {
  let input = document.getElementById("taskInput");
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });
}

function addTask() {
  let input = document.getElementById("taskInput");
  let task = input.value.trim();

  if (task !== "") {
    storage.addTask({ task: task, completed: false, level: 0 });
    input.value = "";
    loadTasks();
  }
}

function removeTask(index) {
  storage.removeTask(index);
  loadTasks();
}

function updateTaskStatus(index, completed) {
  let tasks = storage.getTasks();
  tasks[index].completed = completed;
  storage.updateTask(index, tasks[index]);
}

function editTask(taskElement) {
  let parent = taskElement.parentElement;
  let index = parent.dataset.index;
  let tasks = storage.getTasks();
  let taskInput = makeElement({
    tag: "input",
    type: "text",
    attributes: {
      value: tasks[index].task,
    },
    classes: ["task-input"],
    "events": {
      keys: {
        "Tab": [
          [
            "shift",
            function (event) {
              let parent = taskInput.parentElement;
              event.preventDefault();
              decreaseIndentation(parent);
            }
          ],
          function (event) {
            let parent = taskInput.parentElement;
            event.preventDefault();
            increaseIndentation(parent);
          }
        ],
        Enter: function (event) {
          tasks[index].task = taskInput.value.trim();
          storage.updateTask(index, tasks[index]);
          // Update the task element with the new text
          taskElement.textContent = tasks[index].task;
          parent.replaceChild(taskElement, taskInput);
          enterPressed = true;
        },
        Escape: function (event) {
          // If Escape key is pressed, cancel editing
          taskElement.textContent = tasks[index].task;
          escapePressed = true;
        },
      }
    },
  });

  function increaseIndentation(entry) {
    let currentIndentation = parseInt(entry.style.paddingLeft) || 0;
    entry.style.paddingLeft = (currentIndentation + 2) + "em";
    tasks[index].level += 1;
    storage.updateTask(index, tasks[index]);
  }

  function decreaseIndentation(entry) {
    let currentIndentation = parseInt(entry.style.paddingLeft) || 0;
    entry.style.paddingLeft = Math.max(0, currentIndentation - 2) + "em";
    tasks[index].level = Math.max(0, tasks[index].level - 1);
    storage.updateTask(index, tasks[index]);
  }

  let escapePressed = false; // Flag to track if Escape key is pressed
  let enterPressed = false;

  taskInput.addEventListener("blur", function (e) {
    // Blur event should not trigger if Escape key was pressed
    if (!enterPressed) {
      setTimeout(function () {
        if (!escapePressed) {
          tasks[index].task = taskInput.value.trim();
          storage.updateTask(index, tasks[index]);
          // Update the task element with the new text
          taskElement.textContent = tasks[index].task;
          parent.replaceChild(taskElement, taskInput);
        }
      }, 0);
    }
  });

  // replace taskElement with taskInput
  parent.replaceChild(taskInput, taskElement);

  taskInput.focus();
}