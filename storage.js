function storeAllProjects(projects) {
  //store projects in localStorage
  let projectsString = JSON.stringify(projects)
  localStorage.setItem('projects', projectsString)

}

function getAllProjects() {
  //get projects from localStorage
  let projects = JSON.parse(localStorage.getItem('projects')) || [];
  return projects
}

export {storeAllProjects, getAllProjects}
