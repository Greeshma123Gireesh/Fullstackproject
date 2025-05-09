const resumeInput = document.getElementById('resumeInput');
const resumeName = document.getElementById('resumeName');

if (localStorage.getItem('resumeName')) {
  resumeName.textContent = localStorage.getItem('resumeName');
}

resumeInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem('resume', e.target.result);
      localStorage.setItem('resumeName', file.name);
      resumeName.textContent = file.name;
      alert("Resume uploaded and saved!");
    };
    reader.readAsDataURL(file);
  }
});

const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");

function getJobsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('jobs')) || [];
}

function displayJobs(filter = "") {
  jobList.innerHTML = "";
  const jobs = getJobsFromLocalStorage();
  const filteredJobs = jobs.filter(job => job.jobTitle.toLowerCase().includes(filter.toLowerCase()));
  filteredJobs.forEach(job => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <div class="job-title">${job.jobTitle}</div>
      <div class="job-section"><strong>Skills:</strong><p>${job.skills}</p></div>
      <a href="job.html?title=${encodeURIComponent(job.jobTitle)}" class="view-guidelines-btn-small">📘 View Guidelines</a>
    `;
    jobList.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  displayJobs(searchInput.value);
});

window.onload = () => {
  displayJobs();
};

function logout() {
  alert("Logged out!");
  window.location.href = "index.html";
}