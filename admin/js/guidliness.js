document.getElementById('addJobForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const jobData = {
    jobTitle: document.getElementById('jobTitle').value.trim(),
    skills: document.getElementById('skills').value.trim(),
    learnWhat: document.getElementById('learnWhat').value.trim(),
    achieveHow: document.getElementById('achieveHow').value.trim(),
    roadmap: document.getElementById('roadmap').value.trim(),
    salary: document.getElementById('salary').value.trim(),
    companies: document.getElementById('companies').value.trim()
  };

  try {
    const res = await fetch('http://127.0.0.1:5000/add_job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });

    if (res.ok) {
      alert("Job added successfully!");
      this.reset();
      displayJobs();
    } else {
      const error = await res.json();
      alert("Error: " + error.error);
    }
  } catch (err) {
    alert("Failed to connect to server.");
  }
});

async function displayJobs() {
  const jobsList = document.getElementById('jobsList');
  jobsList.innerHTML = '';

  try {
    const res = await fetch('http://127.0.0.1:5000/get_jobs');
    const jobs = await res.json();

    if (!jobs.length) {
      jobsList.innerHTML = '<p>No jobs added yet!</p>';
      return;
    }

    jobs.forEach((job, index) => {
      const div = document.createElement('div');
      div.classList.add('job-card');

      const jobText = document.createElement('pre');
      jobText.classList.add('job-content');
      jobText.textContent =
`Job Title: ${job.job_title}

Skills Required:
${job.skills}

What to Learn:
${job.learn_what}

How to Achieve:
${job.achieve_how}

Roadmap:
${job.roadmap}

Salary:
${job.salary}

Top Companies:
${job.companies}`;

      div.appendChild(jobText);
      jobsList.appendChild(div);
    });

  } catch (err) {
    jobsList.innerHTML = '<p>Error loading jobs!</p>';
  }
}

window.onload = displayJobs;

function logout() {
  alert("Logged out!");
  window.location.href = "../frontend/index.html";
}
