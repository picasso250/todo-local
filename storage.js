// Create a separate module for local storage operations
const storage = {
  getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  },

  saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  },

  updateTask(index, task) {
    const tasks = this.getTasks();
    tasks[index] = task;
    this.saveTasks(tasks);
  },

  addTask(task) {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  },

  removeTask(index) {
    const tasks = this.getTasks();
    tasks.splice(index, 1);
    this.saveTasks(tasks);
  },
};