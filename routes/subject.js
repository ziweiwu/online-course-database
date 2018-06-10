const express = require('express');
const mysql = require('mysql2');
const parseDBURL = require('parse-database-url');

const router = express.Router();

router.get('/subject', (req, res, next) => {
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

      const subjects = 'select * from subject;';
      con.query(subjects, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render('subject', { subjects: result, title: 'View Subjects' });
        }
      });
    }
  });
});

//  Add new subject
router.post('/add_sub', (req, res, next) => {
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

      const new_sub = req.body.add_sub;
      console.log(new_sub);

      const add_new_sub = `insert into subject(subject_name) values("${new_sub}");`;
      console.log(add_new_sub);
      con.query(add_new_sub, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.redirect('/subject');
        }
      });
    }
  });
});
module.exports = router;
