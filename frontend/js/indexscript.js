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
  
    // Password confirmation check
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    // Save user details to localStorage
    const userDetails = { firstName, lastName, email, password };
    localStorage.setItem("user", JSON.stringify(userDetails));
  
    alert("Signup successful!");
  
    // Redirect to profile page after signup
    window.location.href = "profile.html";
  });
  
  // Handle login form submission
  document.getElementById("loginform").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const emailInput = document.getElementById("username").value.trim(); // Email entered during login
    const passwordInput = document.getElementById("login-password").value.trim();
  
    // Retrieve user details from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
  
    if (storedUser) {
      if (storedUser.email === emailInput && storedUser.password === passwordInput) {
        alert("Login successful!");
  
        // Redirect to home page
        window.location.href = "home.html";
      } else {
        alert("Invalid email or password!");
      }
    } else {
      alert("No user found! Please signup first.");
    }
  });
  