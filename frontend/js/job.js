window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const jobTitle = urlParams.get('title');
    document.getElementById("jobTitle").innerText = jobTitle;
  
    analyzeResume(jobTitle);
  };
  
  // Analyze resume
  function analyzeSkills() {
  const resumeInput = document.getElementById('resumeInput');
  const resumeData = resumeInput.files[0];

  if (!resumeData) {
    alert("Please upload your resume first!");
    return;
  }

  const formData = new FormData();
  formData.append('resume', resumeData);

  fetch('/analyze', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    const extractedSkills = data.extracted_skills || [];
    const requiredSkills = Array.isArray(job.skills) ? job.skills : job.skills.split(",");
    const missingSkills = requiredSkills.filter(skill => 
      !extractedSkills.map(s => s.toLowerCase().trim()).includes(skill.toLowerCase().trim())
    );

    document.getElementById("skillAnalysis").innerHTML = `
      <p><strong>Extracted Skills from Resume:</strong> ${extractedSkills.join(", ")}</p>
      <p><strong>Missing Skills for this Job:</strong> ${missingSkills.length ? missingSkills.join(", ") : "None! You match all skills."}</p>
    `;
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while analyzing the resume.');
  });
}

  // Extract skills from resume text (for example purposes, use a simple approach)
  function extractSkillsFromText(text) {
    const skills = ["Python", "JavaScript", "React", "Node.js", "SQL"]; // Example skills
    const extractedSkills = skills.filter(skill => text.includes(skill));
    return extractedSkills;
  }
  