// window.onload = function() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const jobTitle = urlParams.get('title');
//     document.getElementById("jobTitle").innerText = jobTitle;
  
//     analyzeResume(jobTitle);
//   };
  
//   // Analyze resume
//   function analyzeSkills() {
//   const resumeInput = document.getElementById('resumeInput');
//   const resumeData = resumeInput.files[0];

//   if (!resumeData) {
//     alert("Please upload your resume first!");
//     return;
//   }

//   const formData = new FormData();
//   formData.append('resume', resumeData);

//   fetch('/analyze', {
//     method: 'POST',
//     body: formData
//   })
//   .then(response => response.json())
//   .then(data => {
//     const extractedSkills = data.extracted_skills || [];
//     const requiredSkills = Array.isArray(job.skills) ? job.skills : job.skills.split(",");
//     const missingSkills = requiredSkills.filter(skill => 
//       !extractedSkills.map(s => s.toLowerCase().trim()).includes(skill.toLowerCase().trim())
//     );

//     document.getElementById("skillAnalysis").innerHTML = `
//       <p><strong>Extracted Skills from Resume:</strong> ${extractedSkills.join(", ")}</p>
//       <p><strong>Missing Skills for this Job:</strong> ${missingSkills.length ? missingSkills.join(", ") : "None! You match all skills."}</p>
//     `;
//   })
//   .catch(error => {
//     console.error('Error:', error);
//     alert('An error occurred while analyzing the resume.');
//   });
// }

//   // Extract skills from resume text (for example purposes, use a simple approach)
//   function extractSkillsFromText(text) {
//     const skills = ["Python", "JavaScript", "React", "Node.js", "SQL"]; // Example skills
//     const extractedSkills = skills.filter(skill => text.includes(skill));
//     return extractedSkills;
//   }
  
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  function renderPlainList(text) {
    if (!text) return "No data available.";
    const lines = text.trim().split('\n').filter(line => line.trim() !== '');
    return lines.join('\n');
  }

  const title = getQueryParam("title");
  const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
  const job = jobs.find(j => j.jobTitle === title);

  if (job) {
    document.getElementById("jobTitle").textContent = job.jobTitle;
    document.getElementById("jobSkills").textContent = renderPlainList(job.skills);
    document.getElementById("jobDescription").textContent = renderPlainList(job.learnWhat);
    document.getElementById("achieveHow").textContent = renderPlainList(job.achieveHow);
    document.getElementById("roadmap").textContent = renderPlainList(job.roadmap);
    document.getElementById("salary").textContent = renderPlainList(job.salary);
    document.getElementById("companies").textContent = renderPlainList(job.companies);
  } else {
    document.querySelector(".container").innerHTML =
      "<h2>Job not found</h2><a href='index.html' class='back-link'>&larr; Back to job list</a>";
  }

  function analyzeSkills() {
    const resumeData = localStorage.getItem('resume');
    if (!resumeData) {
      alert("Please upload your resume first!");
      return;
    }

    const formData = new FormData();
    const blob = dataURLtoBlob(resumeData);
    formData.append('resume', blob, localStorage.getItem('resumeName') || 'resume.pdf');

    fetch('http://127.0.0.1:5000/analyze', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.extracted_skills) {
        const requiredSkills = Array.isArray(job.skills) ? job.skills : job.skills.split("\n");
        const missingSkills = requiredSkills.filter(skill =>
          !data.extracted_skills.map(s => s.toLowerCase().trim()).includes(skill.toLowerCase().trim())
        );
        document.getElementById("skillAnalysis").innerHTML =
          `<p><strong>Extracted Skills from Resume:</strong> ${data.extracted_skills.join(", ")}</p>
           <p><strong>Missing Skills for this Job:</strong> ${missingSkills.length ? missingSkills.join(", ") : "None! You match all skills."}</p>`;
      } else {
        alert('Error analyzing resume skills');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error analyzing resume skills');
    });
  }

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

  function logout() {
    alert("Logged out!");
    window.location.href = "index.html";
  }

  // Resume upload and display
  const resumeInput = document.getElementById("resumeInput");
  const resumeName = document.getElementById("resumeName");

  resumeInput.addEventListener("change", function () {
    if (resumeInput.files.length > 0) {
      const file = resumeInput.files[0];
      resumeName.textContent = file.name;
      const reader = new FileReader();
      reader.onload = function (e) {
        localStorage.setItem('resume', e.target.result);
        localStorage.setItem('resumeName', file.name);
      };
      reader.readAsDataURL(file);
    }
  });

  window.addEventListener("DOMContentLoaded", () => {
    const storedName = localStorage.getItem('resumeName');
    if (storedName) {
      resumeName.textContent = storedName;
    }
  });