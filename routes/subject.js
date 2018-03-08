var express = require('express');
var mysql = require('mysql');
var router = express.Router();

router.get('/subject', function(req, res, next) {

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

      var subjects = 'select * from subject;';
      con.query(subjects, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render('subject', {subjects: result, title: 'View Subjects'});
        }
      });
    }
  });
});

module.exports = router;
