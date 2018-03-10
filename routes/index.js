var express = require('express');
var mysql = require('mysql2');
var parseDBURL = require('parse-database-url');
var router = express.Router();

// load search page
router.get('/', function(req, res) {
  var DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  var DB_config = parseDBURL(DB_URL);
  console.log(DB_config);
  var localDBPass = process.env.mysqlPASS || 'password';
  // connect to mysql
  var host = DB_config.host || 'localhost';
  var user = DB_config.user || 'root';
  var password = DB_config.password || localDBPass;
  var database = DB_config.database || 'online-course-app';
  var con = mysql.createConnection({
    reconnect: 'true',
    driver: 'mysql',
    host: host,
    user: user,
    password: password,
    database: database
  });
  con.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');
      //query for course information include id, name, org, platform, and subject
      var courses = [], platforms = [], orgs = [], subjects = [], topics = [];

      var find_course = 'select course_name from course';
      con.query(find_course, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);

          result.forEach(function(element) {
            if (!courses.includes(element.course_name)) {
              courses.push(element.course_name);
            }
          });

          var find_platform = 'select platform_name from platform';
          con.query(find_platform, function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              result.forEach(function(element) {
                if (!platforms.includes(element.platform_name) &&
                    element.platform_name != null) {
                  platforms.push(element.platform_name);
                }
              });

              var find_org = 'select org_name from organization';
              con.query(find_org, function(err, result) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(result);

                  result.forEach(function(element) {
                    if (!orgs.includes(element.org_name) &&
                        element.org_name !== null) {
                      orgs.push(element.org_name);
                    }
                  });

                  var find_subject = 'select subject_name from subject';
                  con.query(find_subject, function(err, result) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(result);

                      result.forEach(function(element) {
                        if (!subjects.includes(element.subject_name) &&
                            element.subject_name !== null) {
                          subjects.push(element.subject_name);
                        }
                      });

                      var find_topic = 'select topic_name from topic';
                      con.query(find_topic, function(err, result) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log(result);

                          result.forEach(function(element) {
                            if (!topics.includes(
                                    element.topic_name) &&
                                element.topic_name !== null) {
                              topics.push(element.topic_name);
                            }
                          });
                          console.log(courses);
                          console.log(platforms);
                          console.log(orgs);
                          console.log(subjects);
                          console.log(topics);

                          res.render('index', {
                            courses: courses,
                            platforms: platforms,
                            orgs: orgs,
                            subjects: subjects,
                            topics: topics,
                            title: 'Search Courses'
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

// search a course by any key term
router.post('/by_any', function(req, res) {
  var DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  var DB_config = parseDBURL(DB_URL);
  console.log(DB_config);
  var localDBPass = process.env.mysqlPASS || 'password';
// connect to mysql
  var host = DB_config.host || 'localhost';
  var user = DB_config.user || 'root';
  var password = DB_config.password || localDBPass;
  var database = DB_config.database || 'online-course-app';
  var con = mysql.createConnection({
    reconnect: 'true',
    driver: 'mysql',
    host: host,
    user: user,
    password: password,
    database: database
  });

  con.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');
      console.log(req.body);
      //get form data for course
      var any = req.body.any;

      var search_course = 'select course_id, course_name, org_name, platform_name, subject_name, '
          +
          't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'where '
          + 'subject_name="' + any + '" or '
          + 'course_name="' + any + '" or '
          + 'org_name="' + any + '" or '
          + 'platform_name="' + any + '" or '
          + 't1.topic_name="' + any + '" or '
          + 't2.topic_name="' + any + '" '
          + 'order by course_id asc;';

      console.log(search_course);
      con.query(search_course, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var courses = result;
          console.log(courses);
          res.render('search/by_any', {courses: courses});
        }
      });
    }
  });
});

// search a course by course name
router.post('/by_name', function(req, res) {
  var DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  var DB_config = parseDBURL(DB_URL);
  console.log(DB_config);
  var localDBPass = process.env.mysqlPASS || 'password';
// connect to mysql
  var host = DB_config.host || 'localhost';
  var user = DB_config.user || 'root';
  var password = DB_config.password || localDBPass;
  var database = DB_config.database || 'online-course-app';
  var con = mysql.createConnection({
    reconnect: 'true',
    driver: 'mysql',
    host: host,
    user: user,
    password: password,
    database: database
  });

  con.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');
      console.log(req.body);
      //get form data for course
      var courseName = req.body.course;

      var search_course = 'select course_id, course_name, org_name, platform_name, subject_name, '
          + 't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'where '
          + 'course_name="' + courseName + '" '
          + 'order by course_id asc;';

      console.log(search_course);
      con.query(search_course, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var courses = result;
          console.log(courses);
          res.render('search/by_name', {courses: courses});
        }
      });
    }
  });
});

// search a course by organization
router.post('/by_org', function(req, res) {
  var DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  var DB_config = parseDBURL(DB_URL);
  console.log(DB_config);
  var localDBPass = process.env.mysqlPASS || 'password';
// connect to mysql
  var host = DB_config.host || 'localhost';
  var user = DB_config.user || 'root';
  var password = DB_config.password || localDBPass;
  var database = DB_config.database || 'online-course-app';
  var con = mysql.createConnection({
    reconnect: 'true',
    driver: 'mysql',
    host: host,
    user: user,
    password: password,
    database: database
  });

  con.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');
      console.log(req.body);
      //get organization
      var organization = req.body.organization;
      //search course by organization
      var search_course = 'select course_id, course_name, org_name, platform_name, subject_name, '
          + 't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'where '
          + 'org_name="' + organization + '" '
          + 'order by course_id asc;';

      console.log(search_course);
      con.query(search_course, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var courses = result;
          console.log(courses);
          res.render('search/by_org', {courses: courses});
        }
      });
    }
  });
});

// search a course by platform
router.post('/by_platform', function(req, res) {
  var DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  var DB_config = parseDBURL(DB_URL);
  console.log(DB_config);
  var localDBPass = process.env.mysqlPASS || 'password';
  // connect to mysql
  var host = DB_config.host || 'localhost';
  var user = DB_config.user || 'root';
  var password = DB_config.password || localDBPass;
  var database = DB_config.database || 'online-course-app';
  var con = mysql.createConnection({
    reconnect: 'true',
    driver: 'mysql',
    host: host,
    user: user,
    password: password,
    database: database
  });

  con.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');
      //get form data for course
      var platform = req.body.platform;

      var search_course = 'select course_id, course_name, org_name, platform_name, subject_name, '
          + 't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'where '
          + 'platform_name="' + platform + '" '
          + 'order by course_id asc;';

      console.log(search_course);
      con.query(search_course, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var courses = result;
          console.log(courses);
          res.render('search/by_platform', {courses: courses});
        }
      });
    }
  });
});

// search a course by subject
router.post('/by_subject', function(req, res) {
  var DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  var DB_config = parseDBURL(DB_URL);
  console.log(DB_config);
  var localDBPass = process.env.mysqlPASS || 'password';
  var host = DB_config.host || 'localhost';
  var user = DB_config.user || 'root';
  var password = DB_config.password || localDBPass;
  var database = DB_config.database || 'online-course-app';
  var con = mysql.createConnection({
    reconnect: 'true',
    driver: 'mysql',
    host: host,
    user: user,
    password: password,
    database: database
  });

  con.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');
      // get subject
      var subject = req.body.subject;
      //search course by subject
      var search_course = 'select course_id, course_name, org_name, platform_name, subject_name, '
          + 't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'where '
          + 'subject_name="' + subject + '" '
          + 'order by course_id asc;';

      console.log(search_course);
      con.query(search_course, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var courses = result;
          console.log(courses);
          res.render('search/by_subject', {courses: courses});
        }
      });
    }
  });
});

// search a course by topic
router.post('/by_topic', function(req, res) {
  var DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  var DB_config = parseDBURL(DB_URL);
  console.log(DB_config);
  var localDBPass = process.env.mysqlPASS || 'password';
  var host = DB_config.host || 'localhost';
  var user = DB_config.user || 'root';
  var password = DB_config.password || localDBPass;
  var database = DB_config.database || 'online-course-app';
  var con = mysql.createConnection({
    reconnect: 'true',
    driver: 'mysql',
    host: host,
    user: user,
    password: password,
    database: database
  });

  con.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mysql Connected!');
      console.log(req.body);
      //get topic
      var topic = req.body.topic;
      //search course by by topic
      var search_course = 'select course_id, course_name, org_name, platform_name, subject_name, '
          + 't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'where '
          + 't1.topic_name="' + topic + '" or '
          + 't2.topic_name="' + topic + '" '
          + 'order by course_id asc;';

      console.log(search_course);
      con.query(search_course, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var courses = result;
          console.log(courses);
          res.render('search/by_topic', {courses: courses});
        }
      });
    }
  });
});

module.exports = router;

