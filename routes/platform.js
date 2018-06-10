const express = require('express');
const mysql = require('mysql2');
const parseDBURL = require('parse-database-url');

const router = express.Router();

router.get('/platform', (req, res, next) => {
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

      const platforms = 'select * from platform;';
      con.query(platforms, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render('platform', { platforms: result, title: 'View Platforms' });
        }
      });
    }
  });
});

//  Add new platform
router.post('/add_plat', (req, res, next) => {
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

      const new_plat = req.body.add_plat;
      console.log(new_plat);

      const add_new_platform = `insert into platform(platform_name) values("${new_plat}");`;
      console.log(add_new_platform);
      con.query(add_new_platform, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.redirect('/platform');
        }
      });
    }
  });
});
module.exports = router;
