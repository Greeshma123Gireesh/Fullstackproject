const API_BASE = "http://127.0.0.1:5000";

// 📦 Get URL query parameter
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// 🧾 Render multi-line text
function renderPlainList(text) {
  if (!text) return "No data available.";
  const lines = text.trim().split('\n').filter(line => line.trim() !== '');
  return lines.join('\n');
}

const title = getQueryParam("title");

// 🔎 Fetch job details based on title
fetch(`${API_BASE}/get_jobs`)
  .then(response => response.json())
  .then(jobs => {
    const job = jobs.find(j => j.job_title === title);
    if (job) {
      document.getElementById("jobTitle").textContent = job.job_title;
      document.getElementById("jobSkills").textContent = renderPlainList(job.skills);
      document.getElementById("jobDescription").textContent = renderPlainList(job.learn_what);
      document.getElementById("achieveHow").textContent = renderPlainList(job.achieve_how);
      document.getElementById("roadmap").textContent = renderPlainList(job.roadmap);
      document.getElementById("salary").textContent = renderPlainList(job.salary);
      document.getElementById("companies").textContent = renderPlainList(job.companies);
      window.currentJob = job;
    } else {
      document.querySelector(".container").innerHTML =
        "<h2>Job not found</h2><a href='index.html' class='back-link'>&larr; Back to job list</a>";
    }
  })
  .catch(error => {
    console.error("Error fetching jobs:", error);
    document.querySelector(".container").innerHTML =
      "<h2>Error loading job details</h2><a href='index.html' class='back-link'>&larr; Back to job list</a>";
  });

// 📊 Analyze resume
function analyzeSkills() {
  const resumeData = localStorage.getItem('resume');
  if (!resumeData) {
    alert("Please upload your resume first!");
    return;
  }

  const formData = new FormData();
  const blob = dataURLtoBlob(resumeData);
  formData.append('resume', blob, localStorage.getItem('resumeName') || 'resume.pdf');

  fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.extracted_skills) {
        const requiredSkills = Array.isArray(window.currentJob.skills)
          ? window.currentJob.skills
          : window.currentJob.skills.split("\n");

        const missingSkills = requiredSkills.filter(skill =>
          !data.extracted_skills.map(s => s.toLowerCase().trim()).includes(skill.toLowerCase().trim())
        );

        document.getElementById("skillAnalysis").innerHTML = `
          <p><strong>Extracted Skills from Resume:</strong> ${data.extracted_skills.join(", ")}</p>
          <p><strong>Missing Skills for this Job:</strong> ${missingSkills.length ? missingSkills.join(", ") : "None! You match all skills."}</p>`;
      } else {
        alert("Error analyzing resume.");
      }
    })
    .catch(error => {
      console.error("Error analyzing skills:", error);
      alert("Error analyzing resume skills.");
    });
}

// 🧠 Convert dataURL to Blob for upload
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// 🔒 Logout
function logout() {
  alert("Logged out!");
  window.location.href = "index.html";
}

// 📥 Resume Upload + Save to LocalStorage
const resumeInput = document.getElementById("resumeInput");
const resumeName = document.getElementById("resumeName");

resumeInput.addEventListener("change", () => {
  if (resumeInput.files.length > 0) {
    const file = resumeInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem("resume", e.target.result);
      localStorage.setItem("resumeName", file.name);
      resumeName.textContent = file.name;
    };
    reader.readAsDataURL(file);
  }
});

// 📂 Show resume name on page load (from localStorage)
window.addEventListener("DOMContentLoaded", () => {
  const storedName = localStorage.getItem("resumeName");
  if (storedName) {
    resumeName.textContent = storedName;
  }
});
