// ===== Auth.js =====

// Simulate user login (replace with real auth API later)
const user = {
  name: "Vishal Saroj",
  email: "vishal@example.com",
  avatar: "" // You can put image URL here
};

// Reference to auth icon
const authIcon = document.getElementById('authIcon');

// Function to display user info in the auth icon
function displayUser() {
  if (!authIcon) return;

  if (user && user.name) {
    if (user.avatar) {
      authIcon.innerHTML = `<img src="${user.avatar}" alt="User" style="width:100%; height:100%; border-radius:50%;">`;
    } else {
      // Show first letter of user's name
      authIcon.textContent = user.name.charAt(0).toUpperCase();
    }

    // Optional: click to show user menu
    authIcon.addEventListener('click', () => {
      alert(`Logged in as ${user.name}\nEmail: ${user.email}`);
    });
  } else {
    // Show default login icon
    authIcon.textContent = "🔒";
    authIcon.style.background = "#ccc";
    authIcon.addEventListener('click', () => {
      alert("Please login to access your account");
    });
  }
}

// Initialize
displayUser();
