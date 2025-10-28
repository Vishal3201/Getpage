// frontend/assets/js/wfh.js

const backendBaseUrl = 'http://localhost:5005/api'; // Backend API base URL
const containerId = 'wfhContainer';                 // ID of container in HTML
const endpoint = 'wfh';                             // Backend route

async function loadWFH() {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch(`${backendBaseUrl}/${endpoint}`);
    const items = await res.json();

    container.innerHTML = ''; // Clear previous content

    if (!items || items.length === 0) {
      container.innerHTML = '<p>No work-from-home opportunities available.</p>';
      return;
    }

    items.forEach(item => {
      const link = document.createElement('a');
      link.href = item.url || "#";            // Official website link
      link.className = 'job-link';
      link.target = "_blank";                 // Open in new tab
      link.rel = "noopener noreferrer";       // Security
      link.textContent = `${item.title || item.name} - ${item.company || item.provider} (${item.location || item.type || ''})`;
      container.appendChild(link);

      const hr = document.createElement('hr'); // Horizontal line separator
      container.appendChild(hr);
    });

  } catch (err) {
    console.error('Error loading WFH opportunities:', err);
    container.innerHTML = '<p>Unable to load WFH opportunities at this time.</p>';
  }
}

// Load data when page is ready
document.addEventListener('DOMContentLoaded', loadWFH);
