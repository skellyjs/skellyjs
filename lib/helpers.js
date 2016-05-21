'use strict';

var fs = require('fs'); // file system library to read/write files
var path = require('path'); // path library to help manipulate paths

var helpers = {
  /*
   * Find files recursively
   * @param <string> dir - directory
   * @param <function> done - callback function
   * @return errors, <array> files - array of all files
   */
  walk : function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      /* istanbul ignore if */
      if (err) return done(err);
      var pending = list.length;
      /* istanbul ignore if */
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            helpers.walk(file, function(err, res) {
              results = results.concat(res);
              /* istanbul ignore else */
              if (!--pending) done(null, results);
            });
          } else {
            results.push(file);
            /* istanbul ignore else */
            if (!--pending) done(null, results);
          }
        });
      });
    });
  },

  /*
   * Check if a value is a valid email address
   * @param <string> email - email address to check
   * @return <boolean> - true if valid email address
   */
  isValidEmail : function(email) {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);
  }
};

module.exports = helpers;