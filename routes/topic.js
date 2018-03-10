var express = require('express');
var mysql = require('mysql2');
var parseDBURL = require('parse-database-url');
var router = express.Router();

router.get('/topic', function(req, res, next) {
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

      var topic = 'select * from topic;';
      con.query(topic, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render('topic', {topics: result, title: 'View Topics'});
        }
      });
    }
  });
});

//  Add new topic
router.post('/add_topic', function(req, res, next) {
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

      var new_topic = req.body.add_topic;
      console.log(new_topic);

      var add_new_topic = 'insert into topic(topic_name) values("'+ new_topic+ '");';
      console.log(add_new_topic);
      con.query(add_new_topic, function(err, result) {
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
