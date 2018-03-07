var express = require('express');
var router = express.Router();

/* GET add page. */
router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add Courses' });
});

module.exports = router;
