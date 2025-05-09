document.getElementById('addJobForm').addEventListener('submit', function (e) {
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

    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    jobs.push(jobData);
    localStorage.setItem('jobs', JSON.stringify(jobs));

    this.reset();
    displayJobs();
  });

  function displayJobs() {
    const jobsList = document.getElementById('jobsList');
    jobsList.innerHTML = '';
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];

    if (jobs.length === 0) {
      jobsList.innerHTML = '<p>No jobs added yet!</p>';
    } else {
      jobs.forEach((job, index) => {
        const div = document.createElement('div');
        div.classList.add('job-card');

        const jobText = document.createElement('pre');
        jobText.classList.add('job-content');
        jobText.contentEditable = false;
        jobText.textContent =
`Job Title: ${job.jobTitle}

Skills Required:
${job.skills}

What to Learn:
${job.learnWhat}

How to Achieve:
${job.achieveHow}

Roadmap:
${job.roadmap}

Salary:
${job.salary}

Top Companies:
${job.companies}`;

        const actions = document.createElement('div');
        actions.classList.add('job-actions');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.onclick = () => {
          jobText.contentEditable = true;
          jobText.focus();
        };

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.classList.add('save-btn');
        saveBtn.onclick = () => {
          const editedLines = jobText.textContent.trim().split('\n');
          job.jobTitle = editedLines[0].replace('Job Title: ', '').trim();
          job.skills = extractField('Skills Required:', editedLines);
          job.learnWhat = extractField('What to Learn:', editedLines);
          job.achieveHow = extractField('How to Achieve:', editedLines);
          job.roadmap = extractField('Roadmap:', editedLines);
          job.salary = extractField('Salary:', editedLines);
          job.companies = extractField('Top Companies:', editedLines);
          localStorage.setItem('jobs', JSON.stringify(jobs));
          jobText.contentEditable = false;
          alert("Changes saved!");
        };

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');
        removeBtn.onclick = () => {
          jobs.splice(index, 1);
          localStorage.setItem('jobs', JSON.stringify(jobs));
          displayJobs();
        };

        actions.appendChild(editBtn);
        actions.appendChild(saveBtn);
        actions.appendChild(removeBtn);

        div.appendChild(jobText);
        div.appendChild(actions);
        jobsList.appendChild(div);
      });
    }
  }

  function extractField(header, lines) {
    const start = lines.findIndex(line => line.startsWith(header));
    if (start === -1) return '';
    const content = [];
    for (let i = start + 1; i < lines.length; i++) {
      if (lines[i].trim().endsWith(':')) break;
      content.push(lines[i]);
    }
    return content.join('\n').trim();
  }

  window.onload = displayJobs;

  function logout() {
  alert("Logged out!");
  window.location.href = "../frontend/index.html";
}