var fs = require('fs'); // file system library to read/write files
var path = require('path'); // path library to help manipulate paths

helpers = {
  /*
   * Find files recursively
   * @param <string> dir - directory
   * @param <function> done - callback function
   * @return <array> files - array of all files
   */
  walk : function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            helpers.walk(file, function(err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            results.push(file);
            if (!--pending) done(null, results);
          }
        });
      });
    });
  }
};

module.exports = helpers;