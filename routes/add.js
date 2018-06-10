const express = require('express');
const mysql = require('mysql2');
const parseDBURL = require('parse-database-url');

const router = express.Router();

// get request
router.get('/add', (req, res) => {
  const DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  const DB_config = parseDBURL(DB_URL);
  console.log(DB_config);
  const localDBPass = process.env.mysqlPASS || 'password';
  // connect to mysql
  const host = DB_config.host || 'localhost';
  const user = DB_config.user || 'root';
  const password = DB_config.password || localDBPass;
  const database = DB_config.database || 'online-course-app';
  const con = mysql.createConnection({
    reconnect: 'true',
    driver: 'mysql',
    host,
    user,
    password,
    database,
  });
  con.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');
      // query for course information include id, name, org, platform, and subject
      let courses = [],
        platforms = [],
        orgs = [],
        subjects = [],
        topics = [];

      const find_course = 'select course_name from course';
      con.query(find_course, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);

          result.forEach((element) => {
            if (!courses.includes(element.course_name)) {
              courses.push(element.course_name);
            }
          });

          const find_platform = 'select platform_name from platform';
          con.query(find_platform, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              result.forEach((element) => {
                if (!platforms.includes(element.platform_name) &&
                    element.platform_name != null) {
                  platforms.push(element.platform_name);
                }
              });

              const find_org = 'select org_name from organization';
              con.query(find_org, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(result);

                  result.forEach((element) => {
                    if (!orgs.includes(element.org_name) &&
                        element.org_name !== null) {
                      orgs.push(element.org_name);
                    }
                  });

                  const find_subject = 'select subject_name from subject';
                  con.query(find_subject, (err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(result);

                      result.forEach((element) => {
                        if (!subjects.includes(element.subject_name) &&
                            element.subject_name !== null) {
                          subjects.push(element.subject_name);
                        }
                      });

                      const find_topic = 'select topic_name from topic';
                      con.query(find_topic, (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log(result);

                          result.forEach((element) => {
                            if (!topics.includes(element.topic_name) &&
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
                            courses,
                            platforms,
                            orgs,
                            subjects,
                            topics,
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

// add a course
router.post('/add', (req, res, next) => {
  const DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  const DB_config = parseDBURL(DB_URL);
  console.log(DB_config);
  const localDBPass = process.env.mysqlPASS || 'password';
  // connect to mysql
  const host = DB_config.host || 'localhost';
  const user = DB_config.user || 'root';
  const password = DB_config.password || localDBPass;
  const database = DB_config.database || 'online-course-app';
  const con = mysql.createConnection({
    reconnect: 'true',
    driver: 'mysql',
    host,
    user,
    password,
    database,
  });

  con.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');
      // get form data for course
      const courseName = req.body.course;
      const subject = req.body.subject;
      const platform = req.body.platform;
      const organization = req.body.organization;
      const topic1 = req.body.topic1 || null;
      const topic2 = req.body.topic2 || null;
      const add_course = `${'insert into course (course_name, subject_id, '
          + 'platform_id, org_id, topic1_id, topic2_id) values '
            + '("'}${courseName}",`
            + `(select subject_id from subject where subject_name="${subject
            }"),`
            + `(select platform_id from platform where platform_name="${
              platform}"),`
            + `(select org_id from organization where org_name="${
              organization
            }"),`
            + `(select topic_id from topic where topic_name="${topic1}"),`
            + `(select topic_id from topic where topic_name="${topic2
            }"));`;

      console.log(add_course);
      con.query(add_course, (err, result) => {
        if (err) {
          console.log(err);
          res.redirect('/add');
        } else {
          console.log(result);
          res.redirect('/course');
        }
      });
    }
  });
});

module.exports = router;
