// frontend/assets/js/paid-internships.js

const backendBaseUrl = 'http://localhost:5005/api'; // Backend API base URL
const containerId = 'paidInternshipsContainer';     // ID of container in HTML
const endpoint = 'paid-internships';                // Backend route

async function loadPaidInternships() {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch(`${backendBaseUrl}/${endpoint}`);
    const items = await res.json();

    container.innerHTML = ''; // Clear previous content

    if (!items || items.length === 0) {
      container.innerHTML = '<p>No paid internships available.</p>';
      return;
    }

    items.forEach(item => {
      const link = document.createElement('a');
      link.href = item.url || "#";            // Link to official site
      link.className = 'job-link';
      link.target = "_blank";                 // Open in new tab
      link.rel = "noopener noreferrer";       // Security
      link.textContent = `${item.title || item.name} - ${item.company || item.provider} (${item.location || item.type || ''})`;
      container.appendChild(link);

      const hr = document.createElement('hr'); // Separator
      container.appendChild(hr);
    });

  } catch (err) {
    console.error('Error loading paid internships:', err);
    container.innerHTML = '<p>Unable to load paid internships at this time.</p>';
  }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', loadPaidInternships);
