const express = require('express');
const router = express.Router();

// Example results (like Sarkari results)
const results = [
  { id: 1, exam: "SSC CGL 2025", status: "Released", date: "2025-09-20" },
  { id: 2, exam: "UPSC Prelims 2025", status: "Pending", date: "2025-10-05" }
];

// GET all results
router.get('/', (req, res) => {
  res.json(results);
});

// GET result by id
router.get('/:id', (req, res) => {
  const result = results.find(r => r.id === parseInt(req.params.id));
  if (result) res.json(result);
  else res.status(404).json({ error: "Result not found" });
});

module.exports = router;
