var mysql = require('mysql')
  , async = require('async');

var PRODUCTION_DB = 'app_prod_database'
  , TEST_DB = 'app_test_database';

exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

var state = {
  pool: null,
  mode: null,
};

exports.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: 'localhost',
    user: 'your_user',
    password: 'some_secret',
    database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB
  });

  state.mode = mode;
  done();
};

exports.get = function() {
  return state.pool;
};

exports.fixtures = function(data) {
  var pool = state.pool;
  if (!pool) return done(new Error('Missing database connection.'));

  var names = Object.keys(data.tables);
  async.each(names, function(name, cb) {
    async.each(data.tables[name], function(row, cb) {
      var keys = Object.keys(row)
        , values = keys.map(function(key) { return "'" + row[key] + "'" });

      pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb)
    }, cb)
  }, done)
};

exports.drop = function(tables, done) {
  var pool = state.pool;
  if (!pool) return done(new Error('Missing database connection.'));

  async.each(tables, function(name, cb) {
    pool.query('DELETE * FROM ' + name, cb)
  }, done)
};