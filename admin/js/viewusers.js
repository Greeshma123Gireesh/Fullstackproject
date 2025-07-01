function loadUser() {
    fetch("http://127.0.0.1:5000/get_users")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            return response.json();
        })
        .then(users => {
            const usersList = document.getElementById("users-list");

            if (!users || users.length === 0) {
                usersList.innerHTML = "<tr><td colspan='3'>No users found!</td></tr>";
                return;
            }

            usersList.innerHTML = ""; // Clear old rows if reloading

            users.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                `;
                usersList.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching users:", error);
            alert("Failed to load users. Please check your backend is running.");
        });
}

function logout() {
    alert("Logged out!");
    window.location.href = "../frontend/index.html";
}

window.onload = loadUser;
