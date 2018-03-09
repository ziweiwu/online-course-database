var express = require('express');
var mysql = require('mysql2');
var parseDBURL = require('parse-database-url');
var router = express.Router();

router.get('/platform', function(req, res, next) {
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

      var platforms = 'select * from platform;';
      con.query(platforms, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render('platform', {platforms: result, title: 'View Platforms'});
        }
      });
    }
  });
});

//  Add new platform
router.post('/add_plat', function(req, res, next) {
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

      var new_plat = req.body.add_plat;
      console.log(new_plat);

      var add_new_platform = 'insert into platform(platform_name) values("'+ new_plat + '");';
      console.log(add_new_platform);
      con.query(add_new_platform, function(err, result) {
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
