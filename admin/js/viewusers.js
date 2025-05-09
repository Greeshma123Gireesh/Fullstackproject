function loadUser() {
    const user = JSON.parse(localStorage.getItem("user"));
  
    const usersList = document.getElementById("users-list");
  
    if (!user) {
      usersList.innerHTML = "<tr><td colspan='3'>No users found!</td></tr>";
      return;
    }
  
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.email}</td>
    `;
    usersList.appendChild(row);
  }
  function logout() {
      alert("Logged out!");
      window.location.href = "../frontend/index.html";
  }
  window.onload = loadUser;