// frontend/assets/js/fetchData.js

const backendBaseUrl = 'http://localhost:5005/api'; // Your backend port

// Mapping frontend container IDs to backend endpoints
const categories = {
  latestJobsContainer: 'jobs',
  internshipsContainer: 'internships',
  wfhContainer: 'wfh',
  aicteContainer: 'aicte',
  freeCertificateContainer: 'free-certificate',
  paidInternshipsContainer: 'paid-internships'
};

// Function to fetch and display data
async function loadCategory(containerId, endpoint) {
  const container = document.getElementById(containerId);
  try {
    const response = await fetch(`${backendBaseUrl}/${endpoint}`);
    const items = await response.json();
    container.innerHTML = ''; // clear container

    if (!items || items.length === 0) {
      container.innerHTML = '<p>No items available.</p>';
      return;
    }

    items.forEach(item => {
      const link = document.createElement('a');
      link.href = item.url || '#';           // Official URL
      link.target = '_blank';               // Open in new tab
      link.rel = 'noopener noreferrer';
      link.textContent = `${item.title || item.name} - ${item.company || item.provider} (${item.location || item.type || ''})`;
      link.className = 'job-link';
      container.appendChild(link);

      const hr = document.createElement('hr');
      container.appendChild(hr);
    });

  } catch (err) {
    container.innerHTML = '<p>Unable to load items at this time.</p>';
    console.error(`Error fetching ${endpoint}:`, err);
  }
}

// Load all categories on page load
for (const [containerId, endpoint] of Object.entries(categories)) {
  loadCategory(containerId, endpoint);
}
