const API_BASE = "http://127.0.0.1:5000";  // Flask backend base URL

const resumeInput = document.getElementById('resumeInput');
const resumeName = document.getElementById('resumeName');
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");

// 📂 Load saved resume name if any
if (localStorage.getItem('resumeName')) {
  resumeName.textContent = localStorage.getItem('resumeName');
}

// 📤 Upload resume
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

// 🔄 Fetch jobs from backend and display
function fetchJobsFromBackend() {
  fetch(`${API_BASE}/get_jobs`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) {
        alert("Failed to fetch job listings.");
        return;
      }
      localStorage.setItem('jobs', JSON.stringify(data)); // Optional caching
      displayJobs(data);
    })
    .catch(err => {
      console.error("Error fetching jobs:", err);
      alert("Backend connection failed.");
    });
}

// 📋 Display job cards (only specific fields + keep View Guidelines button)
function displayJobs(jobData, filter = "") {
  jobList.innerHTML = "";

  const filtered = jobData.filter(job =>
    job.job_title.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    jobList.innerHTML = "<p>No jobs found matching your search.</p>";
    return;
  }

  filtered.forEach(job => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <div class="job-title">${job.job_title}</div>
      <div class="job-section"><strong>Skills:</strong><p>${job.skills}</p></div>
      <div class="job-section"><strong>Salary:</strong><p>${job.salary}</p></div>
      <div class="job-section"><strong>Companies:</strong><p>${job.companies}</p></div>
      <a href="job.html?title=${encodeURIComponent(job.job_title)}" class="view-guidelines-btn-small">📘 View Guidelines</a>
    `;
    jobList.appendChild(card);
  });
}

// 🔍 Live Search
searchInput.addEventListener("input", () => {
  const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
  displayJobs(jobs, searchInput.value);
});

// 🚀 Load jobs on page load
window.onload = () => {
  fetchJobsFromBackend();
};

// 🔓 Logout function
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userId");
  window.location.href = "loginsignup.html";
}
