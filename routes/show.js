var express = require('express');
var router = express.Router();

/* GET add page. */
router.get('/Show', function(req, res, next) {
  res.render('show', { title: 'View Courses' });
});

module.exports = router;
