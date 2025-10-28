// backend/routes/wfh.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const wfhFile = path.join(__dirname, '../wfh.json');

// GET all WFH jobs
router.get('/', (req, res) => {
  const wfhJobs = JSON.parse(fs.readFileSync(wfhFile));
  res.json(wfhJobs);
});

// POST new WFH job
router.post('/', (req, res) => {
  const wfhJobs = JSON.parse(fs.readFileSync(wfhFile));
  const { title, company, type, url } = req.body;
  const newJob = {
    id: wfhJobs.length ? wfhJobs[wfhJobs.length - 1].id + 1 : 1,
    title,
    company,
    type,
    url
  };
  wfhJobs.push(newJob);
  fs.writeFileSync(wfhFile, JSON.stringify(wfhJobs, null, 2));
  res.json({ message: 'WFH Job added', job: newJob });
});

// DELETE WFH job by id
router.delete('/:id', (req, res) => {
  const wfhJobs = JSON.parse(fs.readFileSync(wfhFile));
  const filtered = wfhJobs.filter(j => j.id != req.params.id);
  fs.writeFileSync(wfhFile, JSON.stringify(filtered, null, 2));
  res.json({ message: 'WFH Job deleted' });
});

module.exports = router;
