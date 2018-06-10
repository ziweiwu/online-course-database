const express = require('express');
const mysql = require('mysql2');
const parseDBURL = require('parse-database-url');

const router = express.Router();

router.get('/course', (req, res, next) => {
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
      const courses = 'select course_id, course_name, org_name, platform_name, subject_name, '
          + 't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'order by course_id asc;';
      con.query(courses, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const courses = result;
          console.log(courses);
          res.render('course', { courses, title: 'View/Delete Courses' });
        }
      });
    }
  });
});

router.post('/delete', (req, res, next) => {
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
      console.log(req.body.delCourse);
      const del_course = `delete from course where course_id="${req.body.delCourse}";`;
      con.query(del_course, (err, result) => {
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
