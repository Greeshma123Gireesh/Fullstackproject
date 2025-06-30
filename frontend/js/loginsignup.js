// Show signup form
function showsignup() {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("signup-box").style.display = "block";
  }
  
  // Show login form
  function showlogin() {
    document.getElementById("signup-box").style.display = "none";
    document.getElementById("login-box").style.display = "block";
  }
  
  // Handle sign up form submission
  document.getElementById("signupform").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document.getElementById("confirmpassword").value.trim();
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    const userDetails = { firstName, lastName, email, password };
    localStorage.setItem("user", JSON.stringify(userDetails));
  
    alert("Signup successful!");
    window.location.href = "profile.html";
  });
  
  // Handle login form submission
  document.getElementById("loginform").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("login-password").value.trim();
  
    // Admin check
    if (username === "admin" && password === "admin") {
      alert("Admin login successful!");
      window.location.href = "/admin/home.html";
      return;
    }
  
    // Normal user login
    const storedUser = JSON.parse(localStorage.getItem("user"));
  
    if (storedUser) {
      if (storedUser.email === username && storedUser.password === password) {
        alert("Login successful!");
        window.location.href = "home.html";
      } else {
        alert("Invalid email or password!");
      }
    } else {
      alert("No user found! Please signup first.");
    }
  });
  