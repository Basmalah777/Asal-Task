document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskButton = document.getElementById("addTaskButton");
  const errorMessage = document.getElementById("error-message");
  const todoList = document.querySelector("#todoList");
  const filterAllButton = document.querySelector("#filterAll");
  const filterDoneButton = document.querySelector("#filterDone");
  const filterTodoButton = document.querySelector("#filterTodo");
  const deleteAllButton = document.getElementById("deleteAllButton");
  const deleteDoneButton = document.getElementById("deleteDoneButton");

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

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTaskStatus(index));

        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        if (task.completed) taskText.classList.add("completed");

        const editButton = document.createElement("button");
        editButton.innerHTML =
          '<i class="fas fa-pencil-alt" style="color: #ffd43b;"></i>';
        editButton.className = "edit-button";
        editButton.addEventListener("click", () => editTask(index));

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML =
          '<i class="fas fa-trash-alt" style="color: #ff6b6b;"></i>';
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => deleteTask(index));

        taskItem.append(checkbox, taskText, editButton, deleteButton);
        todoList.appendChild(taskItem);
      });
  };

  const toggleTaskStatus = (index) => {
    const tasks = getTasksFromStorage();
    tasks[index].completed = !tasks[index].completed;
    saveTasksToStorage(tasks);
    renderTasks();
  };

  const addTask = () => {
    const taskText = taskInput.value.trim();

    if (!validateTask(taskText)) {
      return;
    }

    const task = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    const tasks = getTasksFromStorage();
    tasks.push(task);
    saveTasksToStorage(tasks);
    renderTasks();
    taskInput.value = "";
    hideError();
  };

  const editTask = (index) => {
    const tasks = getTasksFromStorage();
    const currentTask = tasks[index].text;

    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    const popup = document.createElement("div");
    popup.className = "custom-popup";

    const messageElement = document.createElement("p");
    messageElement.textContent = "Edit Task:";
    messageElement.style.color = "#337eac";

    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = currentTask;
    inputField.className = "popup-input";

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "popup-buttons";

    const saveButton = document.createElement("button");
    saveButton.className = "popup-confirm";
    saveButton.textContent = "Save";

    const cancelButton = document.createElement("button");
    cancelButton.className = "popup-cancel";
    cancelButton.textContent = "Cancel";

    saveButton.addEventListener("click", () => {
      const newText = inputField.value.trim();

      if (newText && newText.length >= 5 && !/^\d/.test(newText)) {
        const tasks = getTasksFromStorage();
        tasks[index].text = newText;
        saveTasksToStorage(tasks);
        renderTasks();
        document.body.removeChild(overlay);
      } else {
        alert("Invalid input. Please check the requirements.");
      }
    });

    cancelButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    // Append elements
    buttonsContainer.append(saveButton, cancelButton);
    popup.append(messageElement, inputField, buttonsContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

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

    buttonsContainer.append(confirmButton, cancelButton);
    popup.append(messageElement, buttonsContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  };

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

  addTaskButton.addEventListener("click", addTask);

  filterAllButton.addEventListener("click", () => renderTasks("all"));
  filterDoneButton.addEventListener("click", () => renderTasks("done"));
  filterTodoButton.addEventListener("click", () => renderTasks("todo"));

  const showPopup = (message, hasItems = true) => {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    const popup = document.createElement("div");
    popup.className = "custom-popup";

    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageElement.style.color = "#337eac";

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "popup-buttons";

    // Single OK button for no items case
    if (!hasItems) {
      const okButton = document.createElement("button");
      okButton.className = "popup-confirm";
      okButton.style.width = "100px";
      okButton.textContent = "OK";
      okButton.onclick = () => document.body.removeChild(overlay);
      buttonsContainer.appendChild(okButton);
    } else {
      const confirmButton = document.createElement("button");
      confirmButton.className = "popup-confirm";
      confirmButton.textContent = "Delete";
      confirmButton.onclick = () => {
        if (message.includes("all tasks")) {
          localStorage.removeItem("tasks");
        } else {
          const tasks = getTasksFromStorage().filter((task) => !task.completed);
          saveTasksToStorage(tasks);
        }
        renderTasks();
        document.body.removeChild(overlay);
      };

      const cancelButton = document.createElement("button");
      cancelButton.className = "popup-cancel";
      cancelButton.textContent = "Cancel";
      cancelButton.onclick = () => document.body.removeChild(overlay);

      buttonsContainer.append(confirmButton, cancelButton);
    }

    popup.append(messageElement, buttonsContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  };

  deleteAllButton.addEventListener("click", () => {
    const tasks = getTasksFromStorage();
    if (tasks.length === 0) {
      showPopup("No tasks to delete", false); // Only OK button
    } else {
      showPopup("Are you sure you want to delete all tasks?", true);
    }
  });

  deleteDoneButton.addEventListener("click", () => {
    const tasks = getTasksFromStorage();
    const doneTasks = tasks.filter((task) => task.completed);
    if (doneTasks.length === 0) {
      showPopup("No completed tasks to delete", false); // Only OK button
    } else {
      showPopup("Are you sure you want to delete all completed tasks?", true);
    }
  });

  // Initial render
  renderTasks();

  function validateTask(task) {
    if (/^\d/.test(task)) {
      showError("Task cannot start with a number");
      return false;
    }

    if (task.trim() === "") {
      showError("Task cannot be empty");
      return false;
    }

    if (task.trim().length < 5) {
      showError("Task must be at least 5 characters long");
      return false;
    }

    hideError();
    return true;
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    taskInput.classList.add("error");
  }

  function hideError() {
    errorMessage.style.display = "none";
    taskInput.classList.remove("error");
  }

  addTaskButton.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  // Update HTML elements text
  if (document.getElementById("addTaskButton")) {
    document.getElementById("addTaskButton").textContent = "Add Task";
  }
  if (document.getElementById("filterAll")) {
    document.getElementById("filterAll").textContent = "All";
  }
  if (document.getElementById("filterDone")) {
    document.getElementById("filterDone").textContent = "Done";
  }
  if (document.getElementById("filterTodo")) {
    document.getElementById("filterTodo").textContent = "Todo";
  }
  if (document.getElementById("deleteAllButton")) {
    document.getElementById("deleteAllButton").textContent = "Delete All Tasks";
  }
  if (document.getElementById("deleteDoneButton")) {
    document.getElementById("deleteDoneButton").textContent =
      "Delete Done Tasks";
  }
  if (document.getElementById("taskInput")) {
    document.getElementById("taskInput").placeholder = "Enter a new task";
  }

  // Add Font Awesome link to head
  const fontAwesomeLink = document.createElement("link");
  fontAwesomeLink.rel = "stylesheet";
  fontAwesomeLink.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
  document.head.appendChild(fontAwesomeLink);

  // الستايل الي لرساله الخطأ
  const style = document.createElement("style");
  style.textContent = `
        .edit-button, .delete-button {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.3rem;
          margin-left: 0.5rem;
          opacity: 0.7;
          transition: opacity 0.3s;
        }
    
        .edit-button:hover, .delete-button:hover {
          opacity: 1;
        }
    
        .task-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
    
        .task-item span {
          flex: 1;
        }
  
        .error-message {
          color: #e74c3c;
          font-size: 0.9rem;
          margin-top: 0.5rem;
          text-align: center;
          display: none;
        }
  
        #taskInput.error {
          border-color: #e74c3c;
          box-shadow: 0 0 0 0.2rem rgba(231, 76, 60, 0.1);
        }
      `;
  document.head.appendChild(style);
});
