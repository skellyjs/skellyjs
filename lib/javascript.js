var fs = require('fs'); // file system library to read/write files
var path = require('path'); // path library to help manipulate paths
var UglifyJS = require('uglify-js'); // minify library

module.exports = function (skelly, callback) {
  // set the base directory to look for less files
  var dir = path.join(skelly.appRoot, skelly.javascriptsRoot);

  var js = {};
  // find all the files in /javascripts
  skelly.helpers.walk(dir, function(err, files) {
    if (err) {
      skelly.intLog.error(err);
      callback(err);
    } else {
      var pending = files.length;

      files.forEach(function(file) {
        // minify each file, include the sourcemap in the output
        var result = UglifyJS.minify(
          file,
          {
            outSourceMap: file.split(skelly.appRoot)[1].split('.js')[0] + '.min.' + skelly.hash + '.js.map'
          }
        );
        // need to remove the physical path to the sourcemap
        result.map = result.map ? result.map.replace(skelly.appRoot,'') : ' ';

        // add the results (code and map) to the global js object
        js[file.split(dir + '/')[1].split('.js')[0] + '.min' + '.js'] = result;
        if (!--pending) callback(null, js);
      });
    }
  });
};



// TODO: add browserify to bundle includes into a single file