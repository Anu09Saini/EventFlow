# EventFlow – Event Task Planner

EventFlow is a JavaScript-based event task management application that helps users organize and track tasks for an event using an interactive Kanban board.

Users can create an event, add and manage tasks, move tasks between different workflow stages using drag-and-drop, search and filter tasks, sort them, and persist application data using browser `localStorage`.


## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JavaScript)
- Browser Local Storage
- HTML5 Drag and Drop

No external JavaScript framework or backend is required.

---

## Project Structure

```text
EventFlow/
│
├── html/
│   ├── index.html
│   ├── dashboard.html
│   ├── task_form.html
│   └── tasks.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── script.js
│   └── tasks.js
│
└── README.md
```

---

## How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/Anu09Saini/EventFlow
```

### 2. Open the project directory

```bash
cd EventFlow
```

### 3. Run the application

You can open the application using a local development server such as the **Live Server** extension in VS Code.

Open:

```text
html/index.html
```

and select:

```text
Open with Live Server
```

The application will open in your browser.

---

## How to Use EventFlow

1. Open the application.
2. Enter the event details.
3. Click the button to create the event.
4. View the event dashboard.
5. Add tasks for the event.
6. View tasks on the Kanban board.
7. Drag tasks between Planned, In Progress, and Completed.
8. Edit or delete individual tasks when required.
9. Search tasks using keywords.
10. Filter tasks by category.
11. Sort tasks by due date, priority, or name.
12. Reset filters when required.
13. Clear completed tasks when they are no longer needed.

---

## Task Workflow

```text
Create Event
     ↓
Event Dashboard
     ↓
Add Task
     ↓
Task Form
     ↓
Kanban Board
     ↓
┌───────────┬───────────────┬─────────────┐
│  Planned  │  In Progress  │  Completed  │
└───────────┴───────────────┴─────────────┘
             Drag & Drop
```

---


## Features

### Event Management

- Create an event with:
  - Event name
  - Event type
  - Event date
  - Event location
- Display event details on the dashboard.
- Store event information in browser `localStorage`.
- Validate required event fields.
- Prevent selection of invalid/past event dates.

### Task Management

Users can create tasks associated with the current event.

Each task contains:

- Task name
- Category
- Due date
- Priority
- Description
- Status

Supported task operations:

- Add a new task
- Edit an existing task
- Delete an individual task
- Confirmation before deleting a task
- Clear all completed tasks
- Confirmation before clearing completed tasks

---

## Kanban Board

Tasks are displayed using a Kanban-style board with three columns:

- Planned
- In Progress
- Completed

New tasks are initially added to the **Planned** column.

Tasks can be dragged and dropped between any of the Kanban columns.

When a task is dropped into another column, its status is automatically updated and saved to `localStorage`.

Example:

```text
Planned  →  In Progress  →  Completed
   ↑             ↓              ↑
   └──────── Drag & Drop ───────┘
```

---

## Search, Filter and Sorting

EventFlow provides controls to easily find and organize tasks.

### Search

Tasks can be searched using keywords such as:

- Task name
- Description
- Category

### Category Filter

Tasks can be filtered by categories such as:

- Venue
- Food & Catering
- Decoration
- Invitations
- Photography
- Entertainment
- Shopping
- Guest Management
- Other

### Sorting

Tasks can be sorted by:

- Due date
- Priority
- Task name

Priority sorting follows:

```text
High
Medium
Low
```

### Reset Filters

The **Reset Filters** button clears the search input and restores the default category and sorting options.

---

## Data Persistence

EventFlow uses browser `localStorage` to persist event and task information.

This means that task data remains available after refreshing the browser.

Example event structure:

```javascript
{
  id: 1791125130389,
  name: "Birthday Party",
  type: "birthday",
  date: "2026-11-14",
  location: "Chandigarh"
}
```

Example task structure:

```javascript
{
  id: 1791125153607,
  eventId: 1791125130389,
  name: "Book Venue",
  category: "venue",
  dueDate: "2026-11-10",
  priority: "high",
  description: "Confirm the venue booking",
  status: "planned"
}
```

The `eventId` connects each task to its associated event.

---

## Validation and Error Handling

The application validates user input before storing data.

Examples include:

- Event name cannot be empty.
- Event type must be selected.
- Event date cannot be empty.
- Event location cannot be empty.
- Task name cannot be empty.
- Task category must be selected.
- Task due date cannot be empty.
- Task priority must be selected.
- Invalid localStorage data is handled safely.

Confirmation dialogs are also displayed before destructive operations such as:

- Deleting an individual task
- Clearing all completed tasks

---


## Responsive Design

The application uses responsive CSS so that the Kanban board can adapt to smaller screen sizes.

On larger screens, the three Kanban columns appear side by side.

On smaller screens, the columns are displayed vertically for better readability.

---

## Future Improvements

Possible future enhancements include:

- Support for managing multiple events
- Event editing and deletion
- Task completion statistics
- Dashboard analytics
- Task reminders and notifications
- Custom task categories
- Dark mode
- Backend and database integration
- User authentication
- Calendar view
- Exporting task data

---
## Loom Video :

Link :   https://www.loom.com/share/ddbb2d70ca6646e2be347a400489f751

---

---
