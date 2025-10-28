document.addEventListener("DOMContentLoaded", () => {
  const jobsContainer = document.getElementById("jobs-container");

  // Fetch jobs from backend API
  fetch("/api/jobs")  // Make sure backend serves jobs.json at /api/jobs
    .then(response => response.json())
    .then(jobs => {
      jobsContainer.innerHTML = ""; // Clear container

      jobs.forEach(job => {
        const jobCard = document.createElement("div");
        jobCard.classList.add("job-card");

        // Ensure URL exists and target="_blank" opens official website
        jobCard.innerHTML = `
          <a href="${job.url}" class="job-link" target="_blank" rel="noopener noreferrer">
            <h3>${job.title}</h3>
            <p>${job.company} | ${job.location}</p>
          </a>
        `;

        jobsContainer.appendChild(jobCard);
      });
    })
    .catch(error => {
      console.error("Error fetching jobs:", error);
      jobsContainer.innerHTML = "<p>Unable to load jobs at the moment.</p>";
    });
});
