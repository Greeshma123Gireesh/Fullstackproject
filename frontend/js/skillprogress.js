const urlParams = new URLSearchParams(window.location.search);
const skillName = urlParams.get("skill");
document.getElementById("skillTitle").innerText = `${skillName} Progress`;

const skills = JSON.parse(localStorage.getItem("skills") || "[]");
const skillIndex = skills.findIndex(skill => skill.name === skillName);
const skill = skills[skillIndex] || { name: skillName, progress: 0 };

function renderProgressBar() {
  const progressFill = document.getElementById("progressFill");
  progressFill.style.width = `${skill.progress}%`;
  progressFill.innerText = `${skill.progress}%`;
}

function renderTopics() {
  const topics = JSON.parse(localStorage.getItem("skillChecklists"))[skillName] || [];
  const tbody = document.querySelector("#topicTable tbody");
  tbody.innerHTML = "";

  const checkedList = JSON.parse(localStorage.getItem(`checked_${skillName}`) || "[]");

  topics.forEach((item, index) => {
    const tr = document.createElement("tr");
    const isSubtopic = item.startsWith("-");
    const rowClass = isSubtopic ? "topic-indent" : "";

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td class="${rowClass}">${item.replace(/^-/, '').trim()}</td>
      <td class="checkbox-container">
        <input type="checkbox" class="topic-check" data-index="${index}" ${checkedList.includes(index) ? "checked" : ""}>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateProgressFromChecklist();
}

function updateProgressFromChecklist() {
  const checkboxes = document.querySelectorAll(".topic-check");
  let completed = 0;
  const checkedIndexes = [];

  checkboxes.forEach((box) => {
    if (box.checked) {
      completed++;
      checkedIndexes.push(parseInt(box.getAttribute("data-index")));
    }
  });

  const newProgress = Math.round((completed / checkboxes.length) * 100);
  skill.progress = newProgress;
  skills[skillIndex] = skill;
  localStorage.setItem("skills", JSON.stringify(skills));
  localStorage.setItem(`checked_${skillName}`, JSON.stringify(checkedIndexes));
  renderProgressBar();

  if (newProgress === 100) {
    document.getElementById("appreciationModal").style.display = "block";
  }
}

function updateProgressFromModal() {
  document.getElementById("completionModal").style.display = "none";
  localStorage.removeItem("lastVisitedResource");
}

function closeAppreciationModal() {
  document.getElementById("appreciationModal").style.display = "none";
}

document.addEventListener("change", function (e) {
  if (e.target.classList.contains("topic-check")) {
    updateProgressFromChecklist();
  }
});

if (skill) {
  renderProgressBar();
  renderTopics();

  const allResources = JSON.parse(localStorage.getItem("skillResources") || "{}");
  const skillResources = allResources[skillName] || [];
  const resourceList = document.getElementById("resourceList");
  resourceList.innerHTML = "";

  skillResources.forEach(resource => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = resource;
    link.target = "_blank";
    link.innerText = resource;

    link.addEventListener("click", () => {
      localStorage.setItem("lastVisitedResource", resource);
    });

    li.appendChild(link);
    resourceList.appendChild(li);
  });

  if (skillResources.length > 0) {
    document.getElementById("resourcesSection").style.display = "block";
  }
}

window.onload = function () {
  const lastVisited = localStorage.getItem("lastVisitedResource");
  if (lastVisited) {
    document.getElementById("completionModal").style.display = "block";
  }
};
const storedUser = JSON.parse(localStorage.getItem('user'));
if (storedUser) {
  document.getElementById('welcomeUser').innerText = `Welcome, ${storedUser.firstName}`;
}

function logout() {
  alert("You have been logged out!");
  window.location.href = "index.html";
}