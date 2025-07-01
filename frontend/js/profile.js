document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("User not logged in.");
    window.location.href = "index.html";
    return;
  }

  document.getElementById("welcomeUser").innerText = "Loading...";

  try {
    const res = await fetch(`http://127.0.0.1:5000/profile/${userId}`);
    if (res.ok) {
      const d = await res.json();
      document.getElementById("welcomeUser").innerText = `Welcome, ${d.first_name}`;

      const fields = [
        { id: "firstName", key: "first_name" },
        { id: "lastName", key: "last_name" },
        { id: "email", key: "email" },
        { id: "aboutMe", key: "about_me" },
        { id: "jobTitle", key: "job_title" },
        { id: "dob", key: "dob" },
        { id: "country", key: "country" },
        { id: "phoneNumber", key: "phone" },
        { id: "linkedin", key: "linkedin" },
        { id: "github", key: "github" },
        { id: "skills", key: "skills" },
        { id: "experience", key: "experience" }
      ];

      fields.forEach(field => {
        if (d[field.key] && document.getElementById(field.id)) {
          document.getElementById(field.id).value = d[field.key];
        }
      });

      // ✅ Show download link if resume exists
      if (d.resume) {
        const resumeLink = document.createElement("a");
        resumeLink.href = `data:application/octet-stream;base64,${d.resume}`;
        resumeLink.download = "resume.pdf";
        resumeLink.innerText = "⬇ Download Resume";
        resumeLink.className = "resume-download";

        const resumeContainer = document.createElement("div");
        resumeContainer.appendChild(resumeLink);
        document.getElementById("resumeUpload").insertAdjacentElement("afterend", resumeContainer);
      }
    } else {
      alert("Failed to load profile.");
    }
  } catch (err) {
    console.error("Fetch profile failed:", err);
  }

  // Submit profile form
  document.getElementById("profileForm").addEventListener("submit", async e => {
    e.preventDefault();

    const formData = new FormData();
    const fieldIds = [
      "firstName", "lastName", "email", "aboutMe", "jobTitle", "dob",
      "country", "phoneNumber", "linkedin", "github", "skills", "experience"
    ];

    fieldIds.forEach(id => {
      formData.append(id, document.getElementById(id).value);
    });

    const file = document.getElementById("resumeUpload").files[0];
    if (file) formData.append("resume", file);

    try {
      const res2 = await fetch(`http://127.0.0.1:5000/profile/${userId}`, {
        method: "POST",
        body: formData
      });

      const result = await res2.json();
      alert(result.message);
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile.");
    }
  });
});

// 🔐 Logout function
function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
  window.location.href = "index.html";
}
