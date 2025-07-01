const API_BASE = "http://127.0.0.1:5000"; // ✅ adjust if needed
let selectedSkill = "";

window.onload = function () {
  loadSkills();
};

function loadSkills() {
  const skills = JSON.parse(localStorage.getItem("skills") || "[]");
  skills.forEach(skill => {
    addSkill(skill.name, skill.progress);
  });
}

// ✅ Fetch resource from DB instead of localStorage
function handleSkillInput() {
  const name = document.getElementById("skillName").value.trim();
  selectedSkill = name;

  const resourceDisplay = document.getElementById("resourceDisplay");
  const resourceList = document.getElementById("resourceList");
  resourceList.innerHTML = "";

  if (!name) {
    resourceDisplay.style.display = "none";
    return;
  }

  fetch(`${API_BASE}/get_all_languages`)
    .then(res => res.json())
    .then(data => {
      const languageData = data.find(lang => lang.language.toLowerCase() === name.toLowerCase());

      if (languageData) {
        languageData.resources.forEach(res => {
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.href = res;
          link.innerText = res;
          link.target = "_blank";
          li.appendChild(link);
          resourceList.appendChild(li);
        });
      } else {
        resourceList.innerHTML = "<li>No resources available</li>";
      }

      resourceDisplay.style.display = "block";
    })
    .catch(err => {
      console.error("Failed to fetch resources:", err);
      resourceList.innerHTML = "<li>Error loading resources</li>";
      resourceDisplay.style.display = "block";
    });
}

function confirmAddSkill() {
  if (!selectedSkill) {
    alert("Please enter a skill name.");
    return;
  }

  const skills = JSON.parse(localStorage.getItem("skills") || "[]");

  if (skills.some(skill => skill.name === selectedSkill)) {
    alert("Skill already exists.");
    return;
  }

  skills.push({ name: selectedSkill, progress: 0 });
  localStorage.setItem("skills", JSON.stringify(skills));

  addSkill(selectedSkill, 0);
  document.getElementById("skillName").value = "";
  document.getElementById("resourceDisplay").style.display = "none";
}

function addSkill(name, progress = 0) {
  const skillsContainer = document.getElementById("skills");

  const skillCard = document.createElement("a");
  skillCard.className = "skill-card";
  skillCard.href = `/frontend/SkillProgress.html?skill=${name}`;

  const skillName = document.createElement("div");
  skillName.className = "skill-name";
  skillName.innerText = name;

  const bar = document.createElement("div");
  bar.className = "progress-bar";

  const fill = document.createElement("div");
  fill.className = "progress-fill";
  fill.style.width = `${progress}%`;
  fill.innerText = `${progress}%`;

  bar.appendChild(fill);
  skillCard.appendChild(skillName);
  skillCard.appendChild(bar);
  skillsContainer.appendChild(skillCard);
}

const storedUser = JSON.parse(localStorage.getItem('user'));
if (storedUser) {
  document.getElementById('welcomeUser').innerText = `Welcome, ${storedUser.firstName}`;
}

function logout() {
  alert("You have been logged out!");
  window.location.href = "index.html";
}
