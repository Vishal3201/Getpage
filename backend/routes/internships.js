// backend/routes/internships.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// internships.json path
const internshipsFile = path.join(__dirname, '../internships.json');

// GET all internships
router.get('/', (req, res) => {
  const internships = JSON.parse(fs.readFileSync(internshipsFile));
  res.json(internships);
});

// POST new internship
router.post('/', (req, res) => {
  const internships = JSON.parse(fs.readFileSync(internshipsFile));
  const { title, provider, type, url } = req.body;
  const newInternship = { id: internships.length ? internships[internships.length - 1].id + 1 : 1, title, provider, type, url };
  internships.push(newInternship);
  fs.writeFileSync(internshipsFile, JSON.stringify(internships, null, 2));
  res.json({ message: 'Internship added', internship: newInternship });
});

// DELETE internship by id
router.delete('/:id', (req, res) => {
  const internships = JSON.parse(fs.readFileSync(internshipsFile));
  const filtered = internships.filter(i => i.id != req.params.id);
  fs.writeFileSync(internshipsFile, JSON.stringify(filtered, null, 2));
  res.json({ message: 'Internship deleted' });
});

module.exports = router;
