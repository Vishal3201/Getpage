const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const jobsFile = path.join(__dirname, '../jobs.json');

// Helper function to read jobs
function readJobs() {
  try {
    return JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
  } catch (err) {
    return []; // return empty array if file missing or corrupted
  }
}

// GET all jobs
router.get('/', (req, res) => {
  const jobs = readJobs();
  res.json(jobs);
});

// POST new job
router.post('/', (req, res) => {
  const jobs = readJobs();
  const { title, company, location, url } = req.body;

  if (!title || !company || !url) {
    return res.status(400).json({ message: "Title, company, and URL are required" });
  }

  const newJob = {
    id: jobs.length ? jobs[jobs.length - 1].id + 1 : 1,
    title,
    company,
    location: location || "",
    url
  };

  jobs.push(newJob);
  fs.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2));
  res.status(201).json({ message: "Job added successfully", job: newJob });
});

// DELETE a job
router.delete('/:id', (req, res) => {
  const jobs = readJobs();
  const filteredJobs = jobs.filter(job => job.id != req.params.id);

  if (filteredJobs.length === jobs.length) {
    return res.status(404).json({ message: "Job not found" });
  }

  fs.writeFileSync(jobsFile, JSON.stringify(filteredJobs, null, 2));
  res.json({ message: "Job deleted successfully" });
});

module.exports = router;
