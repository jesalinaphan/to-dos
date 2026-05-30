import { getAllProjects, storeAllProjects } from "./storage.js";

class Project {
  constructor(projectTitle) {
    this.id = crypto.randomUUID();
    this.projectTitle = projectTitle;
    this.todoList = [];
  }
}

function analyzeClick() {
  let popup = document.querySelector("#project-name-popup");
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-project-button")) {
      popup.showModal();
    } else if (event.target.id === "project-name-close") {
      let projectInput = document.querySelector("#project-name");
      let projectName = projectInput.value.trim();
      if (projectName) {
        addProject(projectName);
      }
      projectInput.value = ""; 
      popup.close();
    } else if (event.target.classList.contains("delete-project-btn")) {
      deleteProject(event.target.dataset.id);
    } else {
      let projectCard = event.target.closest(".project-card");
      if (projectCard) {
        openProject(projectCard.dataset.id);
      }
    }
  });
}

function addProject(projectName) {
  let projects = getAllProjects();
  projects.push(new Project(projectName));
  storeAllProjects(projects);
  displayProjects(projects);
}

function deleteProject(projectId) {
  let projects = getAllProjects();
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === projectId) {
      projects.splice(i, 1);
      break;
    }
  }
  storeAllProjects(projects);
  displayProjects(projects);
}

function displayProjects(projects) {
  let projectsSection = document.querySelector("#projects-section");
  projectsSection.replaceChildren();

  if (projects.length === 0) {
    let defaultAnnouncement = document.createElement("h2");
    defaultAnnouncement.textContent = "Projects go here...";
    projectsSection.appendChild(defaultAnnouncement);
    return;
  }

  for (let i = 0; i < projects.length; i++) {
    let projectCard = document.createElement("div");
    projectCard.classList.add("project-card");
    projectCard.dataset.id = projects[i].id;

    let projectTitle = document.createElement("h3");
    projectTitle.textContent = projects[i].projectTitle;

    let todoCount = document.createElement("p");
    let total = projects[i].todoList ? projects[i].todoList.length : 0;
    let done = projects[i].todoList
      ? projects[i].todoList.filter((t) => t.completed).length
      : 0;
    todoCount.textContent = `${done}/${total} done`;
    todoCount.classList.add("todo-count");

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-project-btn");
    deleteBtn.dataset.id = projects[i].id;

    projectCard.appendChild(projectTitle);
    projectCard.appendChild(todoCount);
    projectCard.appendChild(deleteBtn);
    projectsSection.appendChild(projectCard);
  }
}

function openProject(projectId) {
  window.location.href = `project.html?id=${projectId}`;
}

analyzeClick();
displayProjects(getAllProjects());
