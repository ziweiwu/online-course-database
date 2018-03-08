var express = require('express');
var mysql = require('mysql');
var router = express.Router();

router.get('/course', function(req, res, next) {

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
