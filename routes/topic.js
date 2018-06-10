const express = require('express');
const mysql = require('mysql2');
const parseDBURL = require('parse-database-url');

const router = express.Router();

router.get('/topic', (req, res, next) => {
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

      const topic = 'select * from topic;';
      con.query(topic, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render('topic', { topics: result, title: 'View Topics' });
        }
      });
    }
  });
});

//  Add new topic
router.post('/add_topic', (req, res, next) => {
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

      const new_topic = req.body.add_topic;
      console.log(new_topic);

      const add_new_topic = `insert into topic(topic_name) values("${new_topic}");`;
      console.log(add_new_topic);
      con.query(add_new_topic, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.redirect('/topic');
        }
      });
    }
  });
});


module.exports = router;
