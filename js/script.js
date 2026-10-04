// check the localStorage for missing/invalid EVENT data
function getStoredEvent() {
  const storedEvent = localStorage.getItem("currentEvent");

  if (!storedEvent) {
    return null;
  }

  try {
    return JSON.parse(storedEvent);
  } catch (error) {
    console.error("Invalid event data:", error);
    localStorage.removeItem("currentEvent");
    return null;
  }
}

// check the localStorage for missing/invalid TASK data
function getStoredTasks() {
  const storedTasks = localStorage.getItem("tasks");

  if (!storedTasks) {
    return [];
  }

  try {
    const tasks = JSON.parse(storedTasks);

    if (!Array.isArray(tasks)) {
      return [];
    }

    return tasks;

  } catch (error) {
    console.error("Invalid task data:", error);
    localStorage.removeItem("tasks");
    return [];
  }
}

// =====================================================
// CREATE EVENT
// =====================================================
const eventForm = document.getElementById("eventForm");
if (eventForm) {

  const eventError = document.getElementById("eventError");

  eventForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const eventName = document.getElementById("eventName").value.trim();
    const eventType = document.getElementById("eventType").value;
    const eventDate = document.getElementById("eventDate").value;
    const eventLocation = document.getElementById("eventLocation").value.trim();

    if (eventName === "") {
      eventError.textContent = "Please enter an event name.";
      return;
    }

    if (eventType === "") {
      eventError.textContent = "Please enter an event type.";
      return;
    }

    if (eventDate === "") {
      eventError.textContent = "Please enter an event date.";
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (eventDate < today) {
      eventError.textContent = "Event date cannot be in the past.";
      return;
    }

    if (eventLocation === "") {
      eventError.textContent = "Please enter an event location.";
      return;
    }

    // clear error, after validation
    eventError.textContent = "";

    const newEvent = {
      id: Date.now(),
      name: eventName,
      type: eventType,
      date: eventDate,
      location: eventLocation
    };

    console.log(newEvent);
    localStorage.setItem("currentEvent", JSON.stringify(newEvent));
    window.location.href = "dashboard.html";

  });
};

// =====================================================
// DASHBOARD
// =====================================================
const eventDashboard = document.getElementById("dashboardEventName");
if (eventDashboard) {
  const currentEvent = getStoredEvent();

  if (currentEvent) {

    document.getElementById("dashboardEventName").textContent = currentEvent.name;
    document.getElementById("dashboardEventType").textContent = `Type: ${currentEvent.type}`;
    document.getElementById("dashboardEventDate").textContent = `Date: ${currentEvent.date}`;
    document.getElementById("dashboardEventLocation").textContent = `Location: ${currentEvent.location}`;

  } else {

    document.getElementById("dashboardEventName")
      .textContent = "No event found.";
  }
}

const addTaskBtn = document.getElementById("addTaskButton");

if (addTaskBtn) {
  addTaskBtn.addEventListener("click", function () {
    window.location.href = "task_form.html";
  });
}

// ========================================
// ADD TASK FORM, CREATE AND EDIT
// ========================================

const taskForm = document.getElementById("taskForm");

if (taskForm) {
  // Get current event
  const currentEvent = getStoredEvent();

  if (!currentEvent) {
    alert("No event found. Please create an event first.");
    window.location.href = "index.html";
  }

  // Display event name
  const taskEventName = document.getElementById("taskEventName");
  taskEventName.textContent = `Event: ${currentEvent.name}`;

  // Check if we are editing a task
  const editTaskId = localStorage.getItem("editTaskId");

  // Get submit button
  const taskSubmitButton = document.getElementById("taskSubmitButton");

  // EDIT MODE
  if (editTaskId) {
    // Change button text
    if (taskSubmitButton) {
      taskSubmitButton.textContent = "Update Task";
    }

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Find the task being edited
    const taskToEdit = tasks.find(function (task) {
      return task.id === Number(editTaskId);
    });

    // Fill form with existing task data

    if (taskToEdit) {
      document.getElementById("taskName").value = taskToEdit.name;
      document.getElementById("taskCategory").value = taskToEdit.category;
      document.getElementById("taskDueDate").value = taskToEdit.dueDate;
      document.getElementById("taskPriority").value = taskToEdit.priority;
      document.getElementById("taskDescription").value = taskToEdit.description;
    }
  }

  // FORM SUBMISSION
  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    const taskName = document.getElementById("taskName").value.trim();
    const taskCategory = document.getElementById("taskCategory").value;
    const taskDueDate = document.getElementById("taskDueDate").value;
    const taskPriority = document.getElementById("taskPriority").value;
    const taskDescription = document.getElementById("taskDescription").value.trim();
    const taskError = document.getElementById("taskError");

    // Validations
    if (taskName === "") {
      taskError.textContent = "Please Enter the Task name.";
      return;
    }
    if (taskCategory === "") {
      taskError.textContent = "Please Select a Category.";
      return;
    }
    if (taskDueDate === "") {
      taskError.textContent = "Please Enter the Due Date.";
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (taskDueDate < today) {
      taskError.textContent = "Due date cannot be in the past.";
      return;
    }

    if (taskPriority === "") {
      taskError.textContent = "Please Select a Priority.";
      return;
    }

    // Remove error, after validation passes
    taskError.textContent = "";

    // Get existing tasks
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // EDIT EXISTING TASK
    if (editTaskId) {
      tasks = tasks.map(function (task) {
        if (task.id === Number(editTaskId)) {
          return {

            // Keep existing ID,
            // event ID and status
            ...task,

            // Update these values
            name: taskName,
            category: taskCategory,
            dueDate: taskDueDate,
            priority: taskPriority,
            description: taskDescription
          };
        }

        // Return unchanged task
        return task;
      });

      // Save updated tasks
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // Remove edit mode
      localStorage.removeItem("editTaskId");
      console.log("Task updated successfully.");

    } else {

      // CREATE NEW TASK
      const newTask = {
        id: Date.now(),
        eventId: currentEvent.id,
        name: taskName,
        category: taskCategory,
        dueDate: taskDueDate,
        priority: taskPriority,
        description: taskDescription,
        status: "planned"
      };
      console.log(newTask);

      // Add new task
      tasks.push(newTask);

      // save task to local storage
      localStorage.setItem("tasks", JSON.stringify(tasks));

      console.log("New task added:", newTask)

    }
    window.location.href = "tasks.html";
  });
}



// ========================================
// TASKS PAGE
// ========================================

const plannedTasksContainer = document.getElementById("plannedTasks");

if (plannedTasksContainer) {

  const currentEvent = getStoredEvent();

  if (!currentEvent) {
    alert("No event found.");
    window.location.href = "index.html";
  } else {

    // Display event information

    const tasksEventName = document.getElementById("tasksEventName");
    const tasksEventDetails = document.getElementById("tasksEventDetails");

    tasksEventName.textContent = currentEvent.name;

    tasksEventDetails.textContent =
      `${currentEvent.type} • ${currentEvent.date} • ${currentEvent.location}`;

    // Load tasks from localStorage
    const allTasks = getStoredTasks();

    // Get tasks belonging to current event
    const eventTasks =
      allTasks.filter(function (task) {
        return task.eventId === currentEvent.id;
      });

    let currentTasks = eventTasks;

    // Display tasks
    renderTasks(eventTasks);

    // Add New Task button
    const addNewTaskButton = document.getElementById("addNewTaskButton");

    if (addNewTaskButton) {
      addNewTaskButton.addEventListener("click", function () {

        // Make sure the form opens in CREATE mode
        localStorage.removeItem("editTaskId");
        window.location.href = "task_form.html";
      });
    }
  }
}

// KANBAN VIEW
function renderTasks(tasks) {
  const plannedContainer = document.getElementById("plannedTasks");
  const inProgressContainer = document.getElementById("inProgressTasks");
  const completedContainer = document.getElementById("completedTasks");

  // If we are not on the task page, stop here
  if (!plannedContainer || !inProgressContainer || !completedContainer) {
    return;
  }

  // Clear old cards
  plannedContainer.innerHTML = "";
  inProgressContainer.innerHTML = "";
  completedContainer.innerHTML = "";

  // Counters
  let plannedTotal = 0;
  let inProgressTotal = 0;
  let completedTotal = 0;

  // Create cards
  tasks.forEach(function (task) {
    const taskCard = createTaskCard(task);

    if (task.status === "planned") {
      plannedContainer.appendChild(taskCard);
      plannedTotal++;
    }

    else if (task.status === "in-progress") {
      inProgressContainer.appendChild(taskCard);
      inProgressTotal++;
    }

    else if (task.status === "completed") {
      completedContainer.appendChild(taskCard);
      completedTotal++;
    }

  });

  // Update counts
  const plannedCount = document.getElementById("plannedCount");
  const inProgressCount = document.getElementById("inProgressCount");
  const completedCount = document.getElementById("completedCount");

  if (plannedCount) {
    plannedCount.textContent = plannedTotal;
  }
  if (inProgressCount) {
    inProgressCount.textContent = inProgressTotal;
  }
  if (completedCount) {
    completedCount.textContent = completedTotal;
  }
}


// =====================================================
// CREATE TASK CARDS
// =====================================================
function createTaskCard(task) {

  const card = document.createElement("div");
  card.classList.add("task-card");

  if (task.status === "completed") {
    card.classList.add("completed-task");
  }

  // Make the card draggable
  card.setAttribute("draggable", "true");

  // Store task ID on the card
  card.dataset.id = task.id;

  card.innerHTML = `
      <h4>${task.name}</h4>
      <span class="task-priority priority-${task.priority}"> ${task.priority} </span>
      <p> Category: ${task.category} </p>
      <p> Due Date: ${task.dueDate} </p>
      <p> ${task.description} </p>

      <div class="task-actions">
        <button class="edit-button" data-id="${task.id}"> Edit </button>
        <button class="delete-button" data-id="${task.id}"> Delete </button>
      </div>
    `;


  // DRAG START

  card.addEventListener("dragstart", function (event) {

    event.dataTransfer.setData(
      "text/plain",
      String(task.id)
    );

    event.dataTransfer.effectAllowed = "move";
    card.classList.add("dragging");
  });


  // DRAG END

  card.addEventListener("dragend", function () {
    card.classList.remove("dragging");
  });
  return card;
}


// =====================================================
// KANBAN DRAG AND DROP
// =====================================================

const kanbanColumns = document.querySelectorAll(".kanban-column");
kanbanColumns.forEach(function (column) {

  // DRAG OVER
  column.addEventListener("dragover", function (event) {

    // It allows the drop to happen.
    event.preventDefault();

    event.dataTransfer.dropEffect = "move";
    column.classList.add("drag-over");
    console.log("Dragging over:", column.dataset.status);
  });


  // DRAG LEAVE
  column.addEventListener("dragleave", function () {
    column.classList.remove("drag-over");
  });


  // DROP
  column.addEventListener("drop", function (event) {
    event.preventDefault();
    column.classList.remove("drag-over");

    // Get task ID from dragged card
    const taskId = Number(event.dataTransfer.getData("text/plain"));

    // Get status from the column
    const newStatus = column.dataset.status;

    updateTaskStatus(taskId, newStatus);
  });
});


// =====================================================
// UPDATE TASK STATUS
// =====================================================

function updateTaskStatus(taskId, newStatus) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Find the task and update its status
  tasks = tasks.map(function (task) {
    if (task.id === taskId) {
      task.status = newStatus;
    }
    return task;
  });

  // Save updated tasks
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Get current event
  const currentEvent = getStoredEvent();

  if (!currentEvent) {
    console.log("No current event found.");
    return;
  }

  // Get tasks belonging to current event
  const eventTasks =
    tasks.filter(function (task) {
      return task.eventId === currentEvent.id;
    });

  // Render updated board
  renderTasks(eventTasks);
}


// =====================================================
// CARD BUTTON CLICK EVENTS
// =====================================================
document.addEventListener("click", function (event) {
  // Delete task 
  if (event.target.classList.contains("delete-button")) {
    const taskId = Number(event.target.dataset.id);
    const currentEvent = getStoredEvent();

    if (!currentEvent) {
      return;
    }

    const confirmDelete = confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    deleteTask(taskId, currentEvent.id);
  }

  // Edit task
  if (event.target.classList.contains("edit-button")) {
    const taskId = Number(event.target.dataset.id);

    // Remember which task we want to edit
    localStorage.setItem("editTaskId", taskId);

    window.location.href = "task_form.html";
  }
});

// =====================================================
// delete the individual task card
// =====================================================
function deleteTask(taskId, eventId) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Remove the selected task
  tasks = tasks.filter(function (task) {
    return task.id !== taskId;
  });

  // Save updated tasks
  localStorage.setItem("tasks", JSON.stringify(tasks));

  //  Get remaining tasks for current event
  const eventTasks = tasks.filter(function (task) {
    return task.eventId === eventId;
  });

  renderTasks(eventTasks);
}


// =====================================================
// CLEAR COMPLETED TASKS
// =====================================================
const clearCompletedButton = document.getElementById("clearCompletedButton");

if (clearCompletedButton) {
  clearCompletedButton.addEventListener("click", function () {

    const confirmClear = confirm(
      "Are you sure you want to delete all completed tasks?"
    );

    if (!confirmClear) {
      return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter(function (task) {
      return task.status !== "completed";
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    applyTaskFilters();
  });
}


// =====================================================
// FILTER TASKS
// =====================================================

function applyTaskFilters() {

  // Get current event
  const currentEvent = getStoredEvent();

  if (!currentEvent) {
    return;
  }

  // Get all tasks
  const allTasks = getStoredTasks();

  // Get tasks belonging to current event
  let filteredTasks = allTasks.filter(function (task) {
    return task.eventId === currentEvent.id;
  });


  // SEARCH
  const searchInput = document.getElementById("searchTasks");

  if (searchInput) {
    const searchText = searchInput.value.toLowerCase().trim();

    if (searchText !== "") {
      filteredTasks = filteredTasks.filter(function (task) {
        return (
          task.name.toLowerCase().includes(searchText) ||
          task.description.toLowerCase().includes(searchText) ||
          task.category.toLowerCase().includes(searchText) ||
          task.dueDate.includes(searchText)
        );
      });
    }
  }


  // CATEGORY FILTER

  const categoryFilter = document.getElementById("filterCategory");

  if (categoryFilter) {
    const selectedCategory = categoryFilter.value;

    if (selectedCategory !== "all") {
      filteredTasks = filteredTasks.filter(function (task) {
        return task.category === selectedCategory;
      });
    }
  }


  // SORT
  const sortSelect = document.getElementById("sortTasks");

  if (sortSelect) {
    const sortBy = sortSelect.value;

    // Sort by Due Date

    if (sortBy === "dueDate") {
      filteredTasks.sort(function (a, b) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    // Sort by Priority

    else if (sortBy === "priority") {
      const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3
      };

      filteredTasks.sort(function (a, b) {
        return (
          priorityOrder[a.priority] - priorityOrder[b.priority]
        );
      });
    }

    // Sort by Task Name

    else if (sortBy === "name") {
      filteredTasks.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }


    // Render sorted tasks

    renderTasks(filteredTasks);
  }
}


// =====================================================
// SEARCH EVENT
// =====================================================
const searchInput = document.getElementById("searchTasks");

if (searchInput) {
  searchInput.addEventListener("input", applyTaskFilters);
}

// =====================================================
// CATEGORY FILTER EVENT
// =====================================================
const categoryFilter = document.getElementById("filterCategory");

if (categoryFilter) {
  categoryFilter.addEventListener("change", applyTaskFilters);
}

// =====================================================
// SORT EVENT
// =====================================================
const sortSelect = document.getElementById("sortTasks");

if (sortSelect) {
  sortSelect.addEventListener("change", applyTaskFilters)
}

// =====================================================
// RESET FILTERS
// =====================================================

const resetFiltersButton = document.getElementById("resetFiltersButton");
if (resetFiltersButton) {
  resetFiltersButton.addEventListener("click", function () {

    // Clear search box
    document.getElementById("searchTasks").value = "";

    // Reset category
    document.getElementById("filterCategory").value = "all";

    // Reset sorting
    document.getElementById("sortTasks").value = "dueDate";

    // Show all tasks again
    applyTaskFilters();
  });
}