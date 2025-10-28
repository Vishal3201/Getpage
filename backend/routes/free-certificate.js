const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const certificateFile = path.join(__dirname, '../free-certificate.json');

// GET all free certificates
router.get('/', (req, res) => {
  const certificate = JSON.parse(fs.readFileSync(certificateFile));
  res.json(certificate);
});

// POST new free course
router.post('/', (req, res) => {
  const certificate = JSON.parse(fs.readFileSync(certificateFile));
  const { title, provider, url } = req.body;

  const newcertificate = {
    id: certificate.length ? certificate[certificate.length - 1].id + 1 : 1,
    title,
    provider,
    url
  };

  certificate.push(newcertificate);
  fs.writeFileSync(certificateFile, JSON.stringify(certificate, null, 2));

  res.json({ message: 'Certificate added', certificate: newcertificate });
});

// DELETE a certificate by id
router.delete('/:id', (req, res) => {
  const certificate = JSON.parse(fs.readFileSync(certificateFile));
  const filtered = certificate.filter(c => c.id != req.params.id);
  fs.writeFileSync(certificateFile, JSON.stringify(filtered, null, 2));
  res.json({ message: 'Certificate deleted' });
});

module.exports = router;
