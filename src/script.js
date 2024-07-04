document.addEventListener('DOMContentLoaded', function () {
  // Function to toggle task popup visibility
  window.taskPopup = function() {
    const popup = document.getElementById('addTaskPopup');
    if (popup.style.display === "none") {
      popup.style.display = "flex";
      popup.classList.add('flex-col');
    } else {
      popup.style.display = "none";
      popup.classList.remove('flex-col');
    }
  }

  // Function to add a task
  function addTask(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const taskNameInput = document.getElementById('taskName');
    const taskDescInput = document.getElementById('taskInput');
    const taskDueDateInput = document.getElementById('taskDueDate');
    const tasksContainer = document.getElementById('tasksContainer');

    if (taskNameInput.value.trim() !== "" && taskDescInput.value.trim() !== "" && taskDueDateInput.value.trim() !== "") {
      const now = new Date();
      const currentDate = formatDate(now); // Format the current date
      const dueDate = formatDate(new Date(taskDueDateInput.value)); // Format the due date

      const task = {
        name: taskNameInput.value,
        description: taskDescInput.value,
        dueDate: taskDueDateInput.value,
        createdAt: now.getTime() // Store timestamp of creation
      };

      saveTask(task); // Save task to local storage

      const taskDiv = createTaskElement(task, currentDate, dueDate);
      tasksContainer.appendChild(taskDiv);

      // Clear the inputs
      taskNameInput.value = "";
      taskDescInput.value = "";
      taskDueDateInput.value = "";
    }

    taskPopup(); // Hide the popup after adding the task
  }

  // Save task to local storage
  function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Create task element
  function createTaskElement(task, currentDate, dueDate) {
    const taskDiv = document.createElement('div');
    taskDiv.className = "p-8 m-2 bg-darkGit-100 flex flex-col items-center border rounded border-gray-700 border-r border-solid relative h-36 justify-center";

    const container = document.createElement('div');
    container.className = "flex w-full";

    const dataDiv = document.createElement('div');
    dataDiv.className = "flex flex-col justify-center ml-4";

    const taskName = document.createElement('h4');
    taskName.className = "font-medium text-white text-sm";
    taskName.textContent = task.name;

    const taskDesc = document.createElement('p');
    taskDesc.className = "text-gray-400 text-sm mt-1";
    taskDesc.textContent = task.description;

    const dueDateElem = document.createElement('p');
    dueDateElem.className = "text-gray-400 text-sm";
    dueDateElem.textContent = `Due by: ${dueDate}`;

    const statusDot = document.createElement('div');
    statusDot.className = "h-2 w-2 rounded-full";

    // Check if due date has passed and update the status dot color
    const now = new Date();
    const taskDueDate = new Date(task.dueDate);
    if (taskDueDate < now) {
      statusDot.classList.add('bg-red-500'); // Tailwind CSS red color
    } else {
      statusDot.classList.add('bg-greenGit-100');
    }

    const statusContainer = document.createElement('div');
    statusContainer.className = "flex items-center";

    const checkDiv = document.createElement('div');
    checkDiv.className = "flex items-center ml-auto";

    const finish = document.createElement('button');
    finish.textContent = "Finish";
    finish.className = "text-white text-xs font-medium h-8 bg-greenGit-200 px-3 border rounded border-transparent hover:bg-greenGit-100";

    finish.onclick = function() {
      // Remove task from local storage
      removeTask(task);
      // Remove task from the DOM
      taskDiv.remove();
      console.log('Task removed!');
    };

    const duetimeContainer = document.createElement('div');
    duetimeContainer.className = "absolute bottom-4 right-8";

    const time = document.createElement('p');
    duetimeContainer.appendChild(dueDateElem);

    dataDiv.appendChild(taskName);
    dataDiv.appendChild(taskDesc);
    container.appendChild(statusContainer);
    container.appendChild(dataDiv);
    container.appendChild(checkDiv);
    checkDiv.appendChild(finish);
    taskDiv.appendChild(container);
    taskDiv.appendChild(duetimeContainer);
    statusContainer.appendChild(statusDot);

    return taskDiv;
  }

  // Remove task from local storage
  function removeTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.name !== task.name || t.description !== task.description || t.createdAt !== task.createdAt);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Load tasks from local storage on page load
  function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
      const currentDate = formatDate(new Date(task.createdAt));
      const dueDate = formatDate(new Date(task.dueDate));
      const taskDiv = createTaskElement(task, currentDate, dueDate);
      document.getElementById('tasksContainer').appendChild(taskDiv);
    });
  }

  // Format date as DD/MM/YYYY
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Call loadTasks on page load
  loadTasks();

  // Event listener for form submission
  document.getElementById('taskForm').addEventListener('submit', addTask);
});
