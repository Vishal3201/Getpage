// internships.js
document.addEventListener("DOMContentLoaded", () => {
  const internshipsContainer = document.getElementById("internships-container");

  fetch("/api/internships")  // Backend me internships.json serve ho raha ho
    .then(response => response.json())
    .then(internships => {
      internshipsContainer.innerHTML = ""; // Clear container

      internships.forEach(internship => {
        const card = document.createElement("div");
        card.classList.add("job-card");

        card.innerHTML = `
          <a href="${internship.url}" class="job-link" target="_blank">
            <h3>${internship.title}</h3>
            <p>${internship.company} | ${internship.location}</p>
          </a>
        `;
        internshipsContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error fetching internships:", error);
      internshipsContainer.innerHTML = "<p>Unable to load internships at the moment.</p>";
    });
});
