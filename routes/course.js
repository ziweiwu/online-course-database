var express = require('express');
var mysql = require('mysql2');
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

      var courses = 'select course_id, course_name, org_name, platform_name, subject_name, '
          + 't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'join platform on course.platform_id = platform.platform_id '
          + 'join organization on course.org_id = organization.org_id '
          + 'join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'order by course_id asc;';
      con.query(courses, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var courses = result;
          console.log(courses);
          res.render('course', {courses: courses, title: 'View Courses'});
        }
      });
    }
  });
});

router.post('/delete', function(req, res, next) {
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

      console.log(req.body.delCourse);

      var del_course = 'delete from course where course_name="'  + req.body.delCourse+ '";';
      console.log(del_course);
      con.query(del_course, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/course');
        }
      });
    }
  });
});
module.exports = router;
