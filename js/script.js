// ========================================
// LOCAL STORAGE HELPERS
// ========================================

// Check localStorage for missing/invalid EVENT data
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

// Check localStorage for missing/invalid TASK data
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

// ========================================
// CREATE EVENT
// ========================================

const eventForm = document.getElementById("eventForm");
if (eventForm) {

  const eventError = document.getElementById("eventError");

  eventForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const eventName = document.getElementById("eventName").value.trim();
    const eventType = document.getElementById("eventType").value;
    const eventDate = document.getElementById("eventDate").value;
    const eventLocation = document.getElementById("eventLocation").value.trim();

    // Validate event name
    if (eventName === "") {
      eventError.textContent = "Please enter an event name.";
      return;
    }

    // Validate event type
    if (eventType === "") {
      eventError.textContent = "Please enter an event type.";
      return;
    }

    // Validate event date
    if (eventDate === "") {
      eventError.textContent = "Please enter an event date.";
      return;
    }

    // Validate event date is not in the past
    const today = new Date().toISOString().split("T")[0];
    if (eventDate < today) {
      eventError.textContent = "Event date cannot be in the past.";
      return;
    }

    // Validate event location
    if (eventLocation === "") {
      eventError.textContent = "Please enter an event location.";
      return;
    }

    // Clear error after validation
    eventError.textContent = "";

    // Create event object
    const newEvent = {
      id: Date.now(),
      name: eventName,
      type: eventType,
      date: eventDate,
      location: eventLocation
    };

    console.log(newEvent);

    // Store event
    localStorage.setItem("currentEvent", JSON.stringify(newEvent));

    // Go to dashboard
    window.location.href = "dashboard.html";
  });
}

// ========================================
// DASHBOARD
// ========================================
const eventDashboard = document.getElementById("dashboardEventName");
if (eventDashboard) {
  const currentEvent = getStoredEvent();

  if (currentEvent) {
    document.getElementById("dashboardEventName").textContent = currentEvent.name;
    document.getElementById("dashboardEventType").textContent = `Type: ${currentEvent.type}`;
    document.getElementById("dashboardEventDate").textContent = `Date: ${currentEvent.date}`;
    document.getElementById("dashboardEventLocation").textContent = `Location: ${currentEvent.location}`;

  } else {
    document.getElementById("dashboardEventName").textContent = "No event found.";
  }
}

// DASHBOARD - ADD TASK BUTTON
const addTaskBtn = document.getElementById("addTaskButton");
if (addTaskBtn) {
  addTaskBtn.addEventListener("click", function () {
    window.location.href = "task_form.html";
  });
}

// ========================================
// ADD TASK FORM
// CREATE AND EDIT
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


  // ======================================
  // EDIT MODE
  // ======================================
  if (editTaskId) {

    // Change button text
    if (taskSubmitButton) {
      taskSubmitButton.textContent = "Update Task";
    }

    const tasks = getStoredTasks();

    // Find task being edited
    const taskToEdit = tasks.find(function (task) {
      return (task.id === Number(editTaskId));
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

    // VALIDATIONS
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

    // Validate due date
    const today = new Date().toISOString().split("T")[0];
    if (taskDueDate < today) {
      taskError.textContent = "Due date cannot be in the past.";
      return;
    }

    if (taskPriority === "") {
      taskError.textContent = "Please Select a Priority.";
      return;
    }

    // Clear error
    taskError.textContent = "";

    // Get existing tasks
    let tasks = getStoredTasks();


    // ==================================
    // EDIT EXISTING TASK
    // ==================================

    if (editTaskId) {
      tasks = tasks.map(function (task) {
        if (task.id === Number(editTaskId)) {
          return {

            // Keep existing ID, event ID and status
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
    }

    // CREATE NEW TASK
    else {
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

      // Add new task
      tasks.push(newTask);

      // Save task
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Go to task board
    window.location.href = "tasks.html";
  });
}