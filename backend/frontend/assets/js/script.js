console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {

  // ✅ FIXED: Removed localhost — added relative API paths for Render
  const categories = {
    latestJobsContainer: '/api/jobs',
    internshipsContainer: '/api/internships',
    wfhContainer: '/api/wfh',
    aicteContainer: '/api/aicte',
    freeCoursesContainer: '/api/free-certificate',
    paidInternshipsContainer: '/api/paid-internships'
  };

  const INITIAL_COUNT = 10; 
  const allData = {}; 

  // Function to render items
  const renderItems = (container, items, count) => {
    container.innerHTML = '';
    items.slice(0, count).forEach(item => {
      const title = item.title || item.name || "Untitled";
      let link = item.link || item.url || "#";
      const company = item.company || item.provider || "";
      const location = item.location || item.type || "";

      if (link && !/^https?:\/\//i.test(link)) {
        console.warn("Invalid link found, skipping:", link);
        link = "#";
      }

      const a = document.createElement('a');
      a.href = link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "job-link";
      a.textContent = `${title} - ${company} (${location})`;

      if (link === "#") {
        a.style.pointerEvents = "none";
        a.style.opacity = "0.6";
      }

      container.appendChild(a);
    });
  };

  // Load category data
  Object.entries(categories).forEach(async ([containerId, apiUrl]) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      container.innerHTML = '<p>Loading...</p>';
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p>No items available.</p>';
        return;
      }

      allData[containerId] = data; 
      renderItems(container, data, INITIAL_COUNT);

      const btn = document.querySelector(`.view-more-btn[data-container="${containerId}"]`);
      if (btn) {
        btn.addEventListener('click', () => {
          renderItems(container, allData[containerId], allData[containerId].length);
          btn.style.display = 'none'; 
        });
      }

    } catch (err) {
      console.error(`Error loading ${containerId}:`, err);
      container.innerHTML = '<p>Error loading items.</p>';
    }
  });
});


// ✅ FIXED: DO NOT use localhost — use relative path
const authIcon = document.getElementById('authIcon');
if (authIcon) {
  fetch('/api/auth/me')
    .then(res => res.json())
    .then(user => {
      if (user) {
        if (user.googleId && user.username) {
          authIcon.textContent = user.username.charAt(0).toUpperCase();
        } else if (user.username) {
          authIcon.textContent = user.username.charAt(0).toUpperCase();
        }
      } else {
        window.location.href = '/login.html';
      }
    })
    .catch(() => {
      window.location.href = '/login.html';
    });
}
