var express = require('express');
var mysql = require('mysql2');
var parseDBURL = require('parse-database-url');
var router = express.Router();

// Show all organization
router.get('/org', function(req, res, next) {
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

      var orgs = 'select * from organization;';
      con.query(orgs, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render('org', {orgs: result, title: 'View Organizations'});
        }
      });
    }
  });
});

//  Add new organization
router.post('/add_org', function(req, res, next) {
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

      var new_org = req.body.add_org;
      console.log(new_org);

      var orgs = 'insert into organization(org_name) values("'+ new_org + '");';
      console.log(orgs);
      con.query(orgs, function(err, result) {
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
