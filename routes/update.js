var express = require('express');
var mysql = require('mysql2');
var parseDBURL = require('parse-database-url');
var router = express.Router();

// get request
router.get('/update', function(req, res, next) {
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
      //query for course information include id, name, org, platform, and subject
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
          console.log(result);

          //store platforms, orgs, subjects in arrays and pass to to add page
          var platforms = [], orgs = [], subjects =[], topics = [];
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
            if(!topics.includes(element.topic1_name) && element.topic1_name !==null){
              topics.push(element.topic1_name);
            }
            if(!topics.includes(element.topic2_name) && element.topic2_name !==null){
              topics.push(element.topic2_name);
            }
          });

          console.log(platforms);
          console.log(orgs);
          console.log(subjects);
          console.log(topics);
          res.render('update', {platforms: platforms, orgs: orgs, subjects:subjects, topics: topics, title: 'Update Courses'});
        }
      });
    }
  });
});

//add a course
router.post('/update', function(req, res, next) {
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
      //get form data for course
      var courseName = req.body.course;
      var subject = req.body.subject;
      var platform  = req.body.platform;
      var organization = req.body.organization;
      var topic1 = req.body.topic1;
      var topic2 = req.body.topic2;
      var add_course = 'insert into course (course_name, subject_id, '
          + 'platform_id, org_id, topic1_id, topic2_id) values '
          + '("'+ courseName +  '",'
          + '(select subject_id from subject where subject_name="' + subject + '"),'
          + '(select platform_id from platform where platform_name="' + platform +'"),'
          + '(select org_id from organization where org_name="' + organization +'"),'
          + '(select topic_id from topic where topic_name="' + topic1 +'"),'
          + '(select topic_id from topic where topic_name="' + topic2 +'"));';

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
