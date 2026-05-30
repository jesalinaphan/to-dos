import { getAllProjects, storeAllProjects } from "./storage.js";

class Todo {
  constructor(text) {
    this.id = crypto.randomUUID();
    this.text = text;
    this.completed = false;
  }
}

// The project object loaded from storage for this page session
let currentProject = null;

function init() {
  const projectId = getProjectIdFromURL();
  if (!projectId) {
    window.location.href = "index.html";
    return;
  }
  currentProject = getProjectById(projectId);
  if (!currentProject) {
    window.location.href = "index.html";
    return;
  }
  renderPage();
  analyzeClick();
}

function getProjectIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getProjectById(projectId) {
  const projects = getAllProjects();
  return projects.find((p) => p.id === projectId) || null;
}

function saveCurrentProject() {
  const projects = getAllProjects();
  const index = projects.findIndex((p) => p.id === currentProject.id);
  if (index !== -1) {
    projects[index] = currentProject;
    storeAllProjects(projects);
  }
}

function renderPage() {
  document.title = currentProject.projectTitle;
  document.querySelector("#project-title").textContent =
    currentProject.projectTitle;
  displayTodos(currentProject.todoList);
}

function displayTodos(todos) {
  const todoList = document.querySelector("#todo-list");
  todoList.replaceChildren();

  if (!todos || todos.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "No to-dos yet. Add one above!";
    msg.classList.add("empty-message");
    todoList.appendChild(msg);
    return;
  }

  for (const todo of todos) {
    const item = document.createElement("div");
    item.classList.add("todo-item");
    if (todo.completed) item.classList.add("completed");
    item.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.classList.add("todo-checkbox");

    const text = document.createElement("span");
    text.textContent = todo.text;
    text.classList.add("todo-text");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-todo-btn");
    deleteBtn.dataset.id = todo.id;

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(deleteBtn);
    todoList.appendChild(item);
  }
}

function addTodo(text) {
  currentProject.todoList.push(new Todo(text));
  saveCurrentProject();
  displayTodos(currentProject.todoList);
}

function toggleTodo(todoId) {
  const todo = currentProject.todoList.find((t) => t.id === todoId);
  if (todo) {
    todo.completed = !todo.completed;
    saveCurrentProject();
    displayTodos(currentProject.todoList);
  }
}

function deleteTodo(todoId) {
  currentProject.todoList = currentProject.todoList.filter(
    (t) => t.id !== todoId
  );
  saveCurrentProject();
  displayTodos(currentProject.todoList);
}

function analyzeClick() {
  const popup = document.querySelector("#todo-popup");

  document.addEventListener("click", function (event) {
    if (event.target.id === "back-btn") {
      window.location.href = "index.html";
    } else if (event.target.id === "add-todo-btn") {
      popup.showModal();
    } else if (event.target.id === "todo-submit-btn") {
      const input = document.querySelector("#todo-input");
      const text = input.value.trim();
      if (text) {
        addTodo(text);
      }
      input.value = "";
      popup.close();
    } else if (event.target.classList.contains("delete-todo-btn")) {
      deleteTodo(event.target.dataset.id);
    } else if (event.target.classList.contains("todo-checkbox")) {
      const todoItem = event.target.closest(".todo-item");
      if (todoItem) {
        toggleTodo(todoItem.dataset.id);
      }
    }
  });

  // Allow pressing Enter in the todo input to submit
  document.querySelector("#todo-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      document.querySelector("#todo-submit-btn").click();
    }
  });

  // Allow pressing Enter in the project name input to submit (on index page this
  // is handled separately, but included here for the todo popup consistency)
}

init();
