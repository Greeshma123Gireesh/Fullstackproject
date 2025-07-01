const API_BASE = "http://127.0.0.1:5000";

// 🔄 Toggle Login/Signup Forms
function showsignup() {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("signup-box").style.display = "block";
}

function showlogin() {
  document.getElementById("signup-box").style.display = "none";
  document.getElementById("login-box").style.display = "block";
}

// ✅ Signup Handler
document.getElementById("signupform")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("email").value;

  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password })
    });

    const result = await res.json();

    if (res.status === 200) {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userId", result.userId);
      window.location.href = "/frontend/profile.html";
    }

  } catch (error) {
    console.error("Signup error:", error);
    alert("An error occurred during signup.");
  }
});

// ✅ Login Handler with hardcoded admin and inline error display
document.getElementById("loginform")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("username").value;
  const password = document.getElementById("login-password").value;
  const errorMsg = document.getElementById("login-error");

  // ✅ Hardcoded admin login (bypasses backend)
  if (email === "admin" && password === "admin123") {
    localStorage.setItem("userEmail", "admin");
    localStorage.setItem("userId", "admin");
    window.location.href = "/admin/home.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    if (res.status === 200) {
      errorMsg.style.display = "none";

      localStorage.setItem("userEmail", email);
      localStorage.setItem("userId", result.userId);

      if (result.role === "admin") {
        window.location.href = "/admin/home.html";
      } else {
        window.location.href = "/frontend/home.html";
      }

    } else {
      errorMsg.textContent = "❌ Invalid credentials. Please try again.";
      errorMsg.style.display = "block";
    }

  } catch (error) {
    console.error("Login error:", error);
    errorMsg.textContent = "❌ An error occurred during login.";
    errorMsg.style.display = "block";
  }
});
