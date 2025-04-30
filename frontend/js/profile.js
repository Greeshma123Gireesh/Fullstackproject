// Autofill First Name, Last Name, Email from localStorage when page loads
window.addEventListener("DOMContentLoaded", function () {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser) {
    document.getElementById("firstName").value = storedUser.firstName || '';
    document.getElementById("lastName").value = storedUser.lastName || '';
    document.getElementById("email").value = storedUser.email || '';

    // Optional: Personalized welcome message
    document.querySelector("h1").innerText = `Welcome, ${storedUser.firstName}!`;
  }
});

// Save the profile form when submitted
document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Save Education entries
  const degrees = Array.from(document.getElementsByName("degree[]")).map(input => input.value);
  const institutions = Array.from(document.getElementsByName("institution[]")).map(input => input.value);

  const educationDetails = degrees.map((degree, index) => ({
    degree: degree,
    institution: institutions[index]
  }));
  localStorage.setItem("education", JSON.stringify(educationDetails));

  // Save Resume as base64
  const resumeInput = document.getElementById("resumeUpload");
  const file = resumeInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64String = reader.result.split(',')[1]; // Get base64 string without prefix
      localStorage.setItem("resume", base64String);

      // After resume is saved, redirect to job page
      window.location.href = "job.html?title=Developer";
    };
    reader.readAsDataURL(file);
  } else {
    alert("Profile saved successfully!");
    window.location.href = "job.html?title=Developer";
  }

  // Save other profile details
  const profileData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    aboutMe: document.getElementById("aboutMe").value,
    jobTitle: document.getElementById("jobTitle").value,
    dob: document.getElementById("dob").value,
    country: document.getElementById("country").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    linkedin: document.getElementById("linkedin").value,
    github: document.getElementById("github").value,
    skills: document.getElementById("skills").value,
    experience: document.getElementById("experience").value
  };
  localStorage.setItem("profile", JSON.stringify(profileData));

  // Update basic user info (First Name, Last Name, Email)
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    storedUser.firstName = profileData.firstName;
    storedUser.lastName = profileData.lastName;
    storedUser.email = profileData.email;
    localStorage.setItem("user", JSON.stringify(storedUser));
  }
});

// Add new Education fields
function addEducation() {
  const educationSection = document.getElementById('educationSection');
  const newEntry = document.createElement('div');
  newEntry.classList.add('education-entry');
  newEntry.innerHTML = `
    <label>Degree</label>
    <input type="text" placeholder="Enter your degree" name="degree[]">
    <label>Institution</label>
    <input type="text" placeholder="Enter your institution" name="institution[]">
  `;
  educationSection.appendChild(newEntry);
}
