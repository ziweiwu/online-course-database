var express = require('express');
var mysql = require('mysql');
var parseDBURL = require('parse-database-url');
var router = express.Router();

router.get('/course', function(req, res, next) {
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

      var courses = 'select course_id, course_name, org_name, platform_name, subject_name from course '
                  + 'join platform on course.platform_id = platform.platform_id '
                  + 'join organization on course.org_id = organization.org_id '
                  + 'join subject on course.subject_id = subject.subject_id '
                  + 'order by course_id asc;';
      con.query(courses, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render('course', {courses: result, title: 'View Courses'});
        }
      });
    }
  });
});

module.exports = router;
