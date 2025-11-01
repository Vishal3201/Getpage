console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {

  // ✅ API routes
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

  // ✅ Auto-create container if missing in HTML
  const getContainer = (id) => {
    let c = document.getElementById(id);
    if (!c) {
      console.warn(`⚠️ Container #${id} missing in HTML. Creating it automatically.`);
      c = document.createElement("div");
      c.id = id;
      c.innerHTML = `<p>Loading...</p>`;
      document.body.appendChild(c);
    }
    return c;
  };

  // ✅ Render items function
  const renderItems = (container, items, count) => {
    container.innerHTML = '';
    items.slice(0, count).forEach(item => {
      const title = item.title || item.name || "Untitled";
      let link = item.link || item.url || "#";
      const company = item.company || item.provider || "";
      const location = item.location || item.type || "";

      if (link && !/^https?:\/\//i.test(link)) {
        console.warn("Invalid link found:", link);
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

  // ✅ Load each category
  Object.entries(categories).forEach(async ([containerId, apiUrl]) => {
    const container = getContainer(containerId);

    try {
      container.innerHTML = `<p>Loading...</p>`;

      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = "<p>No items available.</p>";
        return;
      }

      allData[containerId] = data;
      renderItems(container, data, INITIAL_COUNT);

      // ✅ Add view more behavior
      const btn = document.querySelector(`.view-more-btn[data-container="${containerId}"]`);
      if (btn) {
        btn.onclick = () => {
          renderItems(container, data, data.length);
          btn.style.display = "none";
        };
      }

    } catch (err) {
      console.error(`❌ Error loading ${containerId}:`, err);
      container.innerHTML = "<p>Error loading items.</p>";
    }
  });
});


// ✅ Authentication Icon
const authIcon = document.getElementById('authIcon');
if (authIcon) {
  fetch('/api/auth/me')
    .then(res => res.json())
    .then(user => {
      if (user && user.username) {
        authIcon.textContent = user.username.charAt(0).toUpperCase();
      }
    })
    .catch(() => {
      console.warn("Auth check failed.");
    });
}
