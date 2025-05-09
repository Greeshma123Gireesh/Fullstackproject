 // Show welcome username
 const storedUser = JSON.parse(localStorage.getItem('user'));
 if (storedUser) {
   document.getElementById('welcomeUser').innerText = `Welcome, ${storedUser.firstName}`;
 }

 function logout() {
   localStorage.removeItem('user');
   alert("You have been logged out!");
   window.location.href = "index.html";
 }

 window.addEventListener("DOMContentLoaded", function () {
   const storedUser = JSON.parse(localStorage.getItem("user"));
   if (storedUser) {
     document.getElementById("firstName").value = storedUser.firstName || '';
     document.getElementById("lastName").value = storedUser.lastName || '';
     document.getElementById("email").value = storedUser.email || '';
     document.querySelector("h1").innerText = `Welcome, ${storedUser.firstName}!`;
   }
 });

 document.getElementById("profileForm").addEventListener("submit", function (e) {
   e.preventDefault();

   // Save Education
   const degrees = Array.from(document.getElementsByName("degree[]")).map(input => input.value);
   const institutions = Array.from(document.getElementsByName("institution[]")).map(input => input.value);
   const educationDetails = degrees.map((degree, index) => ({
     degree: degree,
     institution: institutions[index]
   }));
   localStorage.setItem("education", JSON.stringify(educationDetails));

   const resumeInput = document.getElementById("resumeUpload");
   const file = resumeInput.files[0];

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

   // Update basic user info
   const storedUser = JSON.parse(localStorage.getItem("user"));
   if (storedUser) {
     storedUser.firstName = profileData.firstName;
     storedUser.lastName = profileData.lastName;
     storedUser.email = profileData.email;
     localStorage.setItem("user", JSON.stringify(storedUser));
   }

   // Save Resume and redirect
   if (file) {
     const reader = new FileReader();
     reader.onloadend = function () {
       const base64String = reader.result;
       localStorage.setItem("resumeFile", base64String);
       localStorage.setItem("resumeName", file.name);
       window.location.href = "job.html?title=Developer";
     };
     reader.readAsDataURL(file);
   } else {
     window.location.href = "job.html?title=Developer";
   }
 });

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
 if (storedUser) {
   document.getElementById('welcomeUser').innerText = `Welcome, ${storedUser.firstName}`;
 }

 function logout() {
   alert("You have been logged out!");
   window.location.href = "index.html";
 }