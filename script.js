document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskButton = document.getElementById("addTaskButton");
  const errorMessage = document.getElementById("error-message");
  const todoList = document.querySelector("#todoList");
  const filterAllButton = document.querySelector("#filterAll");
  const filterDoneButton = document.querySelector("#filterDone");
  const filterTodoButton = document.querySelector("#filterTodo");

  // Helper function to persist data
  const saveTasksToStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const getTasksFromStorage = () => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  };

  // Render tasks on the page
  const renderTasks = (filter = "all") => {
    const tasks = getTasksFromStorage();
    todoList.innerHTML = "";

    tasks
      .filter((task) => {
        if (filter === "all") return true;
        if (filter === "done") return task.completed;
        if (filter === "todo") return !task.completed;
      })
      .forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        if (task.completed) taskText.classList.add("completed");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTaskStatus(index));

        const editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        const editIcon = document.createElement("img");
        editIcon.src =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAjhJREFUSEvFlk1rE0EYx//PTo61Ylg3ibTgC1Khl9A1llqiuYk3v4KfwIsXxZvoxS/hN/CmN61VPLl9sSBFBLU1ZGfSRHrzZXZGVjaSl9m46Y4kkNMs83t+T579PyFM6UNT4uK/gLVuFIQ4XPQ85z1R8MskZx0chpfOOBQ9A7AAjd2CwrXiqWBvGG4V3GpVTzOHvQIw1wf6GqmoXqlsfe6HWwN3u/5x+RM7IMyPtFZj3ynIFdfdbvbOrIHjCzn3bxPwKGVgH3ul4KY1MOf+Ocbk956NCJfuguiBAf7jpHdshmhNxme5jDmvnSWodQIkMbnag6eY2zEWonoemr0EUEnsPjlM1v+aC/8ONB4mZ02HyeXcv3Fi+gZAaWhSvxjMb1mZ6oMD/4KK8AJAOWWIBszjaS8Wg8Nc73G7fXFBK/0agDsuagkYMM+VXFmhCcQYGhMHSKtVW2SOWvuXaVZoptcpgcYxeCLDJgsjFa0Mx+PErZ4UCtJ1z9v4mKHA9AARolaFVs+zmk4CTW11Ao3DYTZD9W2QvpzVdGxWi9DfM26Z0SqEw3DVdYPdDAUOPDKS1Z1mbT4qqJHFbbi47TBcOQrU2GrO/RsEPBlnoIEuY1g9KtQIFsK/D417aeAYqjUa5XKwM2l7xwaI4EtPAbpuutQW1GzMfQ7AM4C/aehGqbTxLo+pcao7neW5SMp9AG0Am3++Wm8Sc7Zc9+0HImgb0BHjeIUpJWf6F7YtUK61aLOIXP+58hQyNfBvxl75H6XgqjYAAAAASUVORK5CYII=";
        editIcon.alt = "Edit";
        editIcon.style.width = "1.2rem";
        editIcon.style.height = "1.2rem";
        editButton.appendChild(editIcon);
        editButton.addEventListener("click", () => editTask(index));

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        const deleteIcon = document.createElement("img");
        deleteIcon.src =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAATNJREFUSEvtlsFKw0AQhv/Zktie9Gqago8gvTddn0EFD4p9A6H4Fh70EQp6EfQZ3KR38REEY8WbnqwJ7mgPlQpNs0mFCO5ed/75ZoaZnSVUdKgiLozBjN3ayH0+BtDICPbNS6ITArRJMsbg2AnOiHC0yCkxnXpp2P81cOwEh0QYmDgEsNdMoss82x8ZP9SlFFrf5InK3GshtlpjpabavwF+qssNrXWvTEZ5GiHEYH2s7udmPCuOHbnJNazlOVzYbB948VN1N88ms6vjlUARo7sMmAmh/x5JC55UwJb6uw9sc5UZKztOs1Wz42TH6T9tJze4ImC7zMMx1TBw7SfRTqF9PHI7+ww6XwZM4AMvGV4UAk+MH51OmwW6X//l1SIBMPEraYTNdHibpTP+0BcBm9hWBv4EED+6H4eFQw4AAAAASUVORK5CYII=";
        deleteIcon.alt = "Delete";
        deleteIcon.style.width = "1.2rem";
        deleteIcon.style.height = "1.2rem";
        deleteButton.appendChild(deleteIcon);
        deleteButton.addEventListener("click", () => deleteTask(index));

        taskItem.append(checkbox, taskText, editButton, deleteButton);
        todoList.appendChild(taskItem);
      });
  };

  // Toggle task status
  const toggleTaskStatus = (index) => {
    const tasks = getTasksFromStorage();
    tasks[index].completed = !tasks[index].completed;
    saveTasksToStorage(tasks);
    renderTasks();
  };

  // Add a new task
  const addTask = () => {
    const task = taskInput.value.trim();

    if (task === "") {
      errorMessage.textContent = "Task cannot be empty.";
    } else if (task.length < 5) {
      errorMessage.textContent = "Task must be at least 5 characters long.";
    } else if (/^\d/.test(task.trim())) {
      errorMessage.textContent = "Task cannot start with a number.";
    } else {
      errorMessage.textContent = ""; // Clear any previous error messages
      const tasks = getTasksFromStorage();
      tasks.push({ text: task, completed: false });
      saveTasksToStorage(tasks);
      renderTasks();
      taskInput.value = ""; // Clear the input field after adding the task
    }
  };

  // Edit a task
  const editTask = (index) => {
    const tasks = getTasksFromStorage();
    const currentTask = tasks[index].text;

    // Create custom popup for editing
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    const popup = document.createElement("div");
    popup.className = "custom-popup";

    const messageElement = document.createElement("p");
    messageElement.textContent = "Edit Task:";

    // Create input field
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = currentTask;
    inputField.className = "popup-input";

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "popup-buttons";

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.className = "popup-confirm";

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.className = "popup-cancel";

    // Add event listeners
    saveButton.addEventListener("click", () => {
      const newTaskText = inputField.value.trim();

      if (!newTaskText) {
        alert("Task cannot be empty.");
        return;
      }
      if (newTaskText.length < 5) {
        alert("Task must be at least 5 characters long.");
        return;
      }
      if (/^\d/.test(newTaskText)) {
        alert("Task cannot start with a number.");
        return;
      }

      tasks[index].text = newTaskText;
      saveTasksToStorage(tasks);
      renderTasks();
      document.body.removeChild(overlay);
    });

    cancelButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    // Append elements
    buttonsContainer.append(saveButton, cancelButton);
    popup.append(messageElement, inputField, buttonsContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Focus input field
    inputField.focus();
    inputField.select();
  };

  // Create custom popup function
  const createCustomPopup = (message, onConfirm) => {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    const popup = document.createElement("div");
    popup.className = "custom-popup";

    const messageElement = document.createElement("p");
    messageElement.textContent = message;

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "popup-buttons";

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Yes";
    confirmButton.className = "popup-confirm";

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "No";
    cancelButton.className = "popup-cancel";

    // Add event listeners
    confirmButton.addEventListener("click", () => {
      onConfirm();
      document.body.removeChild(overlay);
    });

    cancelButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    // Append elements
    buttonsContainer.append(confirmButton, cancelButton);
    popup.append(messageElement, buttonsContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  };

  // Update delete functions to use custom popup
  const deleteTask = (index) => {
    createCustomPopup("Are you sure you want to delete this task?", () => {
      const tasks = getTasksFromStorage();
      tasks.splice(index, 1);
      saveTasksToStorage(tasks);
      renderTasks();
    });
  };

  const deleteAllTasks = () => {
    const tasks = getTasksFromStorage();
    if (tasks.length === 0) {
      createCustomPopup("No tasks to delete");
      return;
    }

    createCustomPopup("Are you sure you want to delete all tasks?", () => {
      localStorage.removeItem("tasks");
      renderTasks();
    });
  };

  const deleteDoneTasks = () => {
    const tasks = getTasksFromStorage();
    const doneTasks = tasks.filter((task) => task.completed);

    if (doneTasks.length === 0) {
      createCustomPopup("No completed tasks to delete");
      return;
    }

    createCustomPopup(
      "Are you sure you want to delete all completed tasks?",
      () => {
        const remainingTasks = tasks.filter((task) => !task.completed);
        saveTasksToStorage(remainingTasks);
        renderTasks();
      }
    );
  };

  // Event listener for the "Add Task" button
  addTaskButton.addEventListener("click", addTask);

  // Event listeners for filters
  filterAllButton.addEventListener("click", () => renderTasks("all"));
  filterDoneButton.addEventListener("click", () => renderTasks("done"));
  filterTodoButton.addEventListener("click", () => renderTasks("todo"));

  // Add these new event listeners
  const deleteAllButton = document.getElementById("deleteAllButton");
  const deleteDoneButton = document.getElementById("deleteDoneButton");

  deleteAllButton.addEventListener("click", deleteAllTasks);
  deleteDoneButton.addEventListener("click", deleteDoneTasks);

  // Initial render
  renderTasks();
});
