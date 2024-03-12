// /routes/xml.js

const express = require('express');
const router = express.Router();

/* GET XML data */
router.get('/', function(req, res, next) {
  res.render('xml', { xmlData: req.xmlData });
});

module.exports = router;
