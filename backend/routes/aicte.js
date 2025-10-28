// backend/routes/aicte.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const aicteFile = path.join(__dirname, '../aicte.json');

// GET all AICTE internships
router.get('/', (req, res) => {
  const internships = JSON.parse(fs.readFileSync(aicteFile));
  res.json(internships);
});

// POST new AICTE internship
router.post('/', (req, res) => {
  const internships = JSON.parse(fs.readFileSync(aicteFile));
  const { title, provider, location, url } = req.body;
  const newInternship = {
    id: internships.length ? internships[internships.length - 1].id + 1 : 1,
    title,
    provider,
    location,
    url
  };
  internships.push(newInternship);
  fs.writeFileSync(aicteFile, JSON.stringify(internships, null, 2));
  res.json({ message: 'AICTE Internship added', internship: newInternship });
});

// DELETE internship by id
router.delete('/:id', (req, res) => {
  const internships = JSON.parse(fs.readFileSync(aicteFile));
  const filtered = internships.filter(i => i.id != req.params.id);
  fs.writeFileSync(aicteFile, JSON.stringify(filtered, null, 2));
  res.json({ message: 'AICTE Internship deleted' });
});

module.exports = router;
