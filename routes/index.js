const express = require('express');
const mysql = require('mysql2');
const parseDBURL = require('parse-database-url');

const router = express.Router();

// load search page
router.get('/', (req, res) => {
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
      // query for course information include id, name, org, platform, and subject
      let courses = [],
        platforms = [],
        orgs = [],
        subjects = [],
        topics = [];

      const find_course = 'select course_name from course';
      con.query(find_course, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);

          result.forEach((element) => {
            if (!courses.includes(element.course_name)) {
              courses.push(element.course_name);
            }
          });

          const find_platform = 'select platform_name from platform';
          con.query(find_platform, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              result.forEach((element) => {
                if (!platforms.includes(element.platform_name) &&
                    element.platform_name != null) {
                  platforms.push(element.platform_name);
                }
              });

              const find_org = 'select org_name from organization';
              con.query(find_org, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(result);

                  result.forEach((element) => {
                    if (!orgs.includes(element.org_name) &&
                        element.org_name !== null) {
                      orgs.push(element.org_name);
                    }
                  });

                  const find_subject = 'select subject_name from subject';
                  con.query(find_subject, (err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(result);

                      result.forEach((element) => {
                        if (!subjects.includes(element.subject_name) &&
                            element.subject_name !== null) {
                          subjects.push(element.subject_name);
                        }
                      });

                      const find_topic = 'select topic_name from topic';
                      con.query(find_topic, (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log(result);

                          result.forEach((element) => {
                            if (!topics.includes(element.topic_name) &&
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
                            courses,
                            platforms,
                            orgs,
                            subjects,
                            topics,
                            title: 'Search Courses',
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
router.post('/by_any', (req, res) => {
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
      console.log(req.body);
      // get form data for course
      const any = req.body.any;

      const search_course = `${'select course_id, course_name, org_name, platform_name, subject_name, '
          +
          't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'where '
          + 'subject_name="'}${any}" or `
          + `course_name="${any}" or `
          + `org_name="${any}" or `
          + `platform_name="${any}" or `
          + `t1.topic_name="${any}" or `
          + `t2.topic_name="${any}" `
          + 'order by course_id asc;';

      console.log(search_course);
      con.query(search_course, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const courses = result;
          console.log(courses);
          res.render('search/by_any', { courses });
        }
      });
    }
  });
});

// search a course by course name
router.post('/by_name', (req, res) => {
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
      console.log(req.body);
      // get form data for course
      const courseName = req.body.course;

      const search_course = `${'select course_id, course_name, org_name, platform_name, subject_name, '
          + 't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'where '
          + 'course_name="'}${courseName}" `
          + 'order by course_id asc;';

      console.log(search_course);
      con.query(search_course, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const courses = result;
          console.log(courses);
          res.render('search/by_name', { courses });
        }
      });
    }
  });
});

// search a course by organization
router.post('/by_org', (req, res) => {
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
      console.log(req.body);
      // get organization
      const organization = req.body.organization;
      // search course by organization
      const search_course = `${'select course_id, course_name, org_name, platform_name, subject_name, '
          + 't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'where '
          + 'org_name="'}${organization}" `
          + 'order by course_id asc;';

      console.log(search_course);
      con.query(search_course, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const courses = result;
          console.log(courses);
          res.render('search/by_org', { courses });
        }
      });
    }
  });
});

// search a course by platform
router.post('/by_platform', (req, res) => {
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
      // get form data for course
      const platform = req.body.platform;

      const search_course = `${'select course_id, course_name, org_name, platform_name, subject_name, '
          + 't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'where '
          + 'platform_name="'}${platform}" `
          + 'order by course_id asc;';

      console.log(search_course);
      con.query(search_course, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const courses = result;
          console.log(courses);
          res.render('search/by_platform', { courses });
        }
      });
    }
  });
});

// search a course by subject
router.post('/by_subject', (req, res) => {
  const DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  const DB_config = parseDBURL(DB_URL);
  console.log(DB_config);
  const localDBPass = process.env.mysqlPASS || 'password';
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
      // get subject
      const subject = req.body.subject;
      // search course by subject
      const search_course = `${'select course_id, course_name, org_name, platform_name, subject_name, '
          + 't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'where '
          + 'subject_name="'}${subject}" `
          + 'order by course_id asc;';

      console.log(search_course);
      con.query(search_course, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const courses = result;
          console.log(courses);
          res.render('search/by_subject', { courses });
        }
      });
    }
  });
});

// search a course by topic
router.post('/by_topic', (req, res) => {
  const DB_URL = process.env.CLEARDB_DATABASE_URL || ' ';
  const DB_config = parseDBURL(DB_URL);
  console.log(DB_config);
  const localDBPass = process.env.mysqlPASS || 'password';
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
      console.log(req.body);
      // get topic
      const topic = req.body.topic;
      // search course by by topic
      const search_course = `${'select course_id, course_name, org_name, platform_name, subject_name, '
          + 't1.topic_name as topic1_name, t2.topic_name as topic2_name from course '
          + 'left join platform on course.platform_id = platform.platform_id '
          + 'left join organization on course.org_id = organization.org_id '
          + 'left join subject on course.subject_id = subject.subject_id '
          + 'left join topic as t1 on course.topic1_id = t1.topic_id '
          + 'left join topic as t2 on course.topic2_id = t2.topic_id '
          + 'where '
          + 't1.topic_name="'}${topic}" or `
          + `t2.topic_name="${topic}" `
          + 'order by course_id asc;';

      console.log(search_course);
      con.query(search_course, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const courses = result;
          console.log(courses);
          res.render('search/by_topic', { courses });
        }
      });
    }
  });
});

module.exports = router;

