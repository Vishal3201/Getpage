const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../paid-internships.json');

// GET all paid internships
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.json(data);
});

module.exports = router;
