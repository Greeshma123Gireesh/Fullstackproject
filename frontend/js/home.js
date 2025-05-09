const storedUser = JSON.parse(localStorage.getItem('user'));
if (storedUser) {
  document.getElementById('welcomeUser').innerText = `Welcome, ${storedUser.firstName}`;
}


function logout() {

  alert("You have been logged out!");
  window.location.href = "index.html";
}

const images = ["images/slide1.jpeg", "images/slide2.jpeg", "images/slide3.jpeg"];
let index = 0;
setInterval(() => {
  index = (index + 1) % images.length;
  document.getElementById("changingImage").src = images[index];
}, 3000);