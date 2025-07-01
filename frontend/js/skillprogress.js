const API_BASE = "http://127.0.0.1:5000"; // Your Flask backend

const urlParams = new URLSearchParams(window.location.search);
const skillName = urlParams.get("skill");
document.getElementById("skillTitle").innerText = `${skillName} Progress`;

let checkedIndexes = [];

// Fetch data from backend
fetch(`${API_BASE}/get_all_languages`)
  .then(res => res.json())
  .then(data => {
    const langData = data.find(item => item.language.toLowerCase() === skillName.toLowerCase());
    if (!langData) {
      alert("No data found for this skill.");
      return;
    }

    // Render Checklist
    const checklist = langData.checklist;
    const tbody = document.querySelector("#topicTable tbody");
    tbody.innerHTML = "";

    checklist.forEach((item, index) => {
      const isSubtopic = item.startsWith("-") || item.startsWith("  ");
      const rowClass = isSubtopic ? "topic-indent" : "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td class="${rowClass}">${item.replace(/^-/, '').trim()}</td>
        <td><input type="checkbox" class="topic-check" data-index="${index}" ${checkedIndexes.includes(index) ? "checked" : ""}></td>
      `;
      tbody.appendChild(tr);
    });

    updateProgressFromChecklist();

    // Render Resources
    const resources = langData.resources;
    const resourceList = document.getElementById("resourceList");
    resourceList.innerHTML = "";

    resources.forEach(resource => {
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

    if (resources.length > 0) {
      document.getElementById("resourcesSection").style.display = "block";
    }
  })
  .catch(err => {
    console.error("Failed to load skill data:", err);
  });

// Progress logic
function updateProgressFromChecklist() {
  const checkboxes = document.querySelectorAll(".topic-check");
  let completed = 0;
  checkedIndexes = [];

  checkboxes.forEach((box) => {
    if (box.checked) {
      completed++;
      checkedIndexes.push(parseInt(box.getAttribute("data-index")));
    }
  });

  const newProgress = Math.round((completed / checkboxes.length) * 100);
  const progressFill = document.getElementById("progressFill");
  progressFill.style.width = `${newProgress}%`;
  progressFill.innerText = `${newProgress}%`;

  if (newProgress === 100) {
    document.getElementById("appreciationModal").style.display = "block";
  }
}

document.addEventListener("change", function (e) {
  if (e.target.classList.contains("topic-check")) {
    updateProgressFromChecklist();
  }
});

function updateProgressFromModal() {
  document.getElementById("completionModal").style.display = "none";
  localStorage.removeItem("lastVisitedResource");
}

function closeAppreciationModal() {
  document.getElementById("appreciationModal").style.display = "none";
}

// Load last visited resource
window.onload = function () {
  const lastVisited = localStorage.getItem("lastVisitedResource");
  if (lastVisited) {
    document.getElementById("completionModal").style.display = "block";
  }

  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser) {
    document.getElementById('welcomeUser').innerText = `Welcome, ${storedUser.firstName}`;
  }
};

function logout() {
  alert("You have been logged out!");
  window.location.href = "index.html";
}
