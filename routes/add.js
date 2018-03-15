var express = require('express');
var mysql = require('mysql2');
var parseDBURL = require('parse-database-url');
var router = express.Router();

// get request
router.get('/add', function(req, res) {
  var DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  var DB_config = parseDBURL(DB_URL);
  console.log(DB_config);
  var localDBPass = process.env.mysqlPASS || 'password';
// connect to mysql
  var host = DB_config.host || 'localhost';
  var user = DB_config.user || 'root';
  var password = DB_config.password || localDBPass;
  var database = DB_config.database || 'online-course-app';
  var con = mysql.createConnection({
    reconnect: 'true',
    driver: 'mysql',
    host: host,
    user: user,
    password: password,
    database: database,
  });
  con.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');
      //query for course information include id, name, org, platform, and subject
      var courses = [], platforms = [], orgs = [], subjects = [], topics = [];

      var find_course = 'select course_name from course';
      con.query(find_course, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);

          result.forEach(function(element) {
            if (!courses.includes(element.course_name)) {
              courses.push(element.course_name);
            }
          });

          var find_platform = 'select platform_name from platform';
          con.query(find_platform, function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              result.forEach(function(element) {
                if (!platforms.includes(element.platform_name) &&
                    element.platform_name != null) {
                  platforms.push(element.platform_name);
                }
              });

              var find_org = 'select org_name from organization';
              con.query(find_org, function(err, result) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(result);

                  result.forEach(function(element) {
                    if (!orgs.includes(element.org_name) &&
                        element.org_name !== null) {
                      orgs.push(element.org_name);
                    }
                  });

                  var find_subject = 'select subject_name from subject';
                  con.query(find_subject, function(err, result) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(result);

                      result.forEach(function(element) {
                        if (!subjects.includes(element.subject_name) &&
                            element.subject_name !== null) {
                          subjects.push(element.subject_name);
                        }
                      });

                      var find_topic = 'select topic_name from topic';
                      con.query(find_topic, function(err, result) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log(result);

                          result.forEach(function(element) {
                            if (!topics.includes(
                                    element.topic_name) &&
                                element.topic_name !== null) {
                              topics.push(element.topic_name);
                            }
                          });
                          console.log(courses);
                          console.log(platforms);
                          console.log(orgs);
                          console.log(subjects);
                          console.log(topics);

                          res.render('add', {
                            courses: courses,
                            platforms: platforms,
                            orgs: orgs,
                            subjects: subjects,
                            topics: topics,
                            title: 'Add Courses',
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

//add a course
  router.post('/add', function(req, res, next) {
    var DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
    var DB_config = parseDBURL(DB_URL);
    console.log(DB_config);
    var localDBPass = process.env.mysqlPASS || 'password';
// connect to mysql
    var host = DB_config.host || 'localhost';
    var user = DB_config.user || 'root';
    var password = DB_config.password || localDBPass;
    var database = DB_config.database || 'online-course-app';
    var con = mysql.createConnection({
      reconnect: 'true',
      driver: 'mysql',
      host: host,
      user: user,
      password: password,
      database: database
    });

    con.connect(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('mysql Connected!');
        //get form data for course
        var courseName = req.body.course;
        var subject = req.body.subject;
        var platform = req.body.platform;
        var organization = req.body.organization;
        var topic1 = req.body.topic1 || null;
        var topic2 = req.body.topic2 || null;
        var add_course = 'insert into course (course_name = ?, subject_id = ?, '
          + 'platform_id = ?, org_id = ?, topic1_id =?, topic2_id = ?) values '
            + '("' + courseName + '",'
            + '(select subject_id from subject where subject_name="' + subject +
            '"),'
            + '(select platform_id from platform where platform_name="' +
            platform + '"),'
            + '(select org_id from organization where org_name="' +
            organization +
            '"),'
            + '(select topic_id from topic where topic_name="' + topic1 + '"),'
            + '(select topic_id from topic where topic_name="' + topic2 +
            '"));';

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
