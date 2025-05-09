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

function handleSkillInput() {
  const name = document.getElementById("skillName").value.trim();
  selectedSkill = name;

  if (!name) {
    document.getElementById("resourceDisplay").style.display = "none";
    return;
  }

  const allResources = JSON.parse(localStorage.getItem("skillResources") || "{}");
  const resourceList = document.getElementById("resourceList");
  resourceList.innerHTML = "";

  if (allResources[name]) {
    allResources[name].forEach(res => {
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

  document.getElementById("resourceDisplay").style.display = "block";
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