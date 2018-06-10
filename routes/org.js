const express = require('express');
const mysql = require('mysql2');
const parseDBURL = require('parse-database-url');

const router = express.Router();

// Show all organization
router.get('/org', (req, res, next) => {
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

      const orgs = 'select * from organization;';
      con.query(orgs, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render('org', { orgs: result, title: 'View Organizations' });
        }
      });
    }
  });
});

//  Add new organization
router.post('/add_org', (req, res, next) => {
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

      const new_org = req.body.add_org;
      console.log(new_org);

      const orgs = `insert into organization(org_name) values("${new_org}");`;
      console.log(orgs);
      con.query(orgs, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.redirect('/org');
        }
      });
    }
  });
});
module.exports = router;
