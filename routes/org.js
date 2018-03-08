var express = require('express');
var mysql = require('mysql');
var router = express.Router();

router.get('/org', function(req, res, next) {

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

      var orgs = 'select * from organization;';
      con.query(orgs, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render('org', {orgs: result, title: 'View Organizations'});
        }
      });
    }
  });
});

module.exports = router;
