var express = require('express');
var mysql = require('mysql');
var router = express.Router();

router.get('/platform', function(req, res, next) {

  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.mysqlPASS,
    database: 'online-course-app'
  });

  con.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');

      var platforms = 'select * from platform;';
      con.query(platforms, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render('platform', {platforms: result, title: 'View Platforms'});
        }
      });
    }
  });
});

module.exports = router;
