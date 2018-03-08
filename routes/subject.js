var express = require('express');
var mysql = require('mysql');
var parseDBURL = require('parse-database-url');
var router = express.Router();

router.get('/subject', function(req, res, next) {
  var DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  var DB_config = parseDBURL(DB_URL) ;
  console.log(DB_config);
  var localDBPass = process.env.mysqlPASS || 'password';
// connect to mysql
  var host =  DB_config.host || 'localhost';
  var user =  DB_config.user || 'root';
  var password = DB_config.password || localDBPass;
  var database = DB_config.database || 'online-course-app';
  var con = mysql.createConnection({
    reconnect: 'true',
    driver: 'mysql',
    host:  host,
    user: user,
    password:  password,
    database:  database
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
