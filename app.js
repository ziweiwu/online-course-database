var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var mysql = require('mysql');
var parseDBURL = require('parse-database-url');

var index = require('./routes/index');
var add = require('./routes/add');
var course = require('./routes/course');
var org = require('./routes/org');
var platform = require('./routes/platform');
var subject = require('./routes/subject');
//load process.env variables
dotenv.load();

var app = express();

//set up database
// if deploy use clearDB database, else use local mySQL
var DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
var DB_config = parseDBURL(DB_URL) ;
console.log(DB_config);
var localDBPass = process.env.mysqlPASS || 'password';
var newDb = 'mysql://b34d5c0f3210b6:be16221e@us-cdbr-iron-east-05.cleardb.net/heroku_3c959113d2d0dc2?reconnect=true';
console.log(parseDBURL(newDb));
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
  }else {
    console.log('mysql Connected!');

    // drop tables if they are made to clean the database
    var disable_foreign_key_check = 'SET FOREIGN_KEY_CHECKS = 0;';
    var enable_foreign_key_check = 'SET FOREIGN_KEY_CHECKS = 1;';
    var drop_tables = 'DROP TABLE if exists course, subject, platform, organization;';
    con.query(disable_foreign_key_check, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Set foreign keys off");
      }
    });
    con.query(drop_tables, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Tables dropped");
      }
    });
    con.query(enable_foreign_key_check, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("set foreign key on");
      }
    });

    // create organization tables
    var create_org_table = 'CREATE TABLE if not exists organization('
        +'org_id INT PRIMARY KEY AUTO_INCREMENT,'
        +'org_name VARCHAR(255) NOT NULL);';
    con.query(create_org_table, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Org Table created");
      }
    });

    // create platform tables
    var create_plat_table= 'CREATE TABLE if not exists platform('
        +'platform_id INT PRIMARY KEY AUTO_INCREMENT,'
        +'platform_name VARCHAR(255) NOT NULL);';
    con.query(create_plat_table, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Platform table created");
      }
    });

    // create subject tables
    var create_subject_table = 'CREATE TABLE if not exists subject('
        +'subject_id INT PRIMARY KEY AUTO_INCREMENT,'
        +'subject_name VARCHAR(255) NOT NULL);';
    con.query(create_subject_table, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("subject table created");
      }
    });

    // create course tables
    var create_course_table = 'CREATE TABLE if not exists course('
        +'course_id INT PRIMARY KEY AUTO_INCREMENT,'
        +'course_name VARCHAR(255) NOT NULL,'
        +'subject_id INT,'
        +'platform_id INT,'
        +'org_id INT,'
        +'FOREIGN KEY(platform_id) REFERENCES platform(platform_id),'
        +'FOREIGN KEY(subject_id) REFERENCES subject(subject_id),'
        +'FOREIGN KEY(org_id) REFERENCES organization(org_id))';
    con.query(create_course_table, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("course table created");
      }
    });

    // Insert data
    // org
    var add_org = 'insert into organization(org_name)'
        +' values("MIT"),'
        + '("Stanford"),'
        + '("UC Berkeley"),'
        + '("UC San Diego");';
    con.query(add_org, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("added orgs");
      }
    });

    // platform
    var add_plat = 'insert into platform(platform_name)'
        +' values("EDX"),'
        + '("Coursera"),'
        + '("Udemy"),'
        + '("Udacity");';
    con.query(add_plat, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("added plats");
      }
    });

    //subjects
    var add_sub = 'insert into subject(subject_name)'
        +' values("Computer Science"),'
        + '("Biology"),'
        + '("Math"),'
        + '("Physics");';
    con.query(add_sub, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("added subjects");
      }
    });

    // courses
    var add_course = 'insert into course(course_name, subject_id,  org_id, platform_id)'
        +' values("Programming in C++", 1, 1, 1),'
        + '("Cell Biology", 2, 2, 2),'
        + '("Quantum Mechanics", 4, 4, 3),'
        + '("Real Analysis", 3, 3, 4),'
        + '("Data Structure", 1, 3, 1);';
    con.query(add_course, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("added courses");
      }
    });

//end of connection function
  }
});
















// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', add);
app.use('/', course);
app.use('/', org);
app.use('/', platform);
app.use('/', subject);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
