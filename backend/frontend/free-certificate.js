// frontend/assets/js/fetchFreeCertificates.js
const backendBaseUrl = 'http://localhost:5005/api'; // Adjust if your backend runs on another port

async function loadFreeCertificates() {
  const container = document.getElementById('freeCoursesContainer');
  try {
    const res = await fetch(`${backendBaseUrl}/free-certificate`);
    const certificates = await res.json();
    container.innerHTML = '';

    if (!certificates || certificates.length === 0) {
      container.innerHTML = '<p>No certificates available.</p>';
      return;
    }

    certificates.forEach(cert => {
      const link = document.createElement('a');
      link.href = cert.url || '#'; // Official link
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${cert.title} - ${cert.provider}`;
      link.className = 'job-link';
      container.appendChild(link);

      const hr = document.createElement('hr');
      container.appendChild(hr);
    });

  } catch (err) {
    container.innerHTML = '<p>Unable to load certificates at this time.</p>';
    console.error('Error loading free certificates:', err);
  }
}

// Call the function to load certificates on page load
loadFreeCertificates();
