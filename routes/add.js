var express = require('express');
var mysql = require('mysql');
var router = express.Router();

// get request
router.get('/add', function(req, res, next) {

  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.mysqlPASS,
    database: 'online-course-app',
  });

  con.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');
      //query for course information include id, name, org, platform, and subject
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

          //store platforms, orgs, subjects in arrays and pass to to add page
          var platforms = [], orgs = [], subjects =[];
          result.forEach(function(element) {
            if(!platforms.includes(element.platform_name)){
              platforms.push(element.platform_name);
            }
            if(!orgs.includes(element.org_name)){
              orgs.push(element.org_name);
            }
            if(!subjects.includes(element.subject_name)){
              subjects.push(element.subject_name);
            }
          });

          console.log(platforms);
          console.log(orgs);
          console.log(subjects);

          res.render('add', {platforms: platforms, orgs: orgs, subjects:subjects, title: 'Add Courses'});
        }
      });
    }
  });
});

//
router.post('/add', function(req, res, next) {

  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.mysqlPASS,
    database: 'online-course-app',
  });

  con.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');
      //get form data for course
      var courseName = req.body.course;
      var subject = req.body.subject;
      var platform  = req.body.platform;
      var organization = req.body.organization;
      console.log(req.body);
      console.log(organization);

      var add_course = 'insert into course (course_name, subject_id, platform_id, org_id) values '
        + '("'+ courseName +  '",'
        + '(select subject_id from subject where subject_name="' + subject + '"),'
        + '(select platform_id from platform where platform_name="' + platform +'"),'
        + '(select org_id from organization where org_name="' + organization +'"));';

      console.log(add_course);
      con.query(add_course, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.redirect('/course');
        }
      });






    }
  });
});


module.exports = router;
