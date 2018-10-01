const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const parseDBURL = require('parse-database-url');
const compression = require('compression');
const index = require('./routes/index');
const add = require('./routes/add');
const course = require('./routes/course');
const org = require('./routes/org');
const platform = require('./routes/platform');
const subject = require('./routes/subject');
const topic = require('./routes/topic');
const update = require('./routes/update');

// load process.env variables
dotenv.load();
const app = express();
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
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
app.use('/', topic);
app.use('/', update);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// port listener
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running at port ${port}`);
});

module.exports = app;
