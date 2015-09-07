var fs = require('fs'); // file system library to read/write files
var less = require('less'); // less compiler library
var path = require('path'); // path library to help manipulate paths
var skelly = require('../skelly');

// set the base directory to look for less files
var dir = path.join(skelly.appRoot, 'stylesheets');

var settings = {
  paths        : [path.join(dir,'includes')],    // .less file search paths for @imports
  outputDir    : path.join(dir,'css'),           // output directory
  optimization : 1,                              // optimization level, higher is better but more volatile - 1 is a good value
  compress     : true,                           // compress?
  yuicompress  : true                            // use YUI compressor?
};

module.exports = function (callback) {
  var css = {};
  // find all the files in /stylesheets
  skelly.helpers.walk(dir, function(err, files) {
    if (err) throw err;
    var pending = files.length;

    files.forEach(function(file) {
      // grab the defaule settings
      var thisSettings = settings;

      // only process files that end in .less
      if (file.substring(file.length-5,file.length) === '.less' && file.indexOf('includes') < 0) {
        // read the file
        fs.readFile(file, 'utf8', function(err, fileContent) {
          if (err) throw err;
          // convert the read buffer into a string
          var cssString = fileContent.toString();
          // set the filename in the settings
          thisSettings.filename = file;

          // compile the less file to css
          less.render(cssString, thisSettings, function(err, output) {
            if (err) throw err;
            // save the css to the css object
            css[file.split(path.join(process.env.PWD,'stylesheets')+'/')[1].split(".less")[0] + (thisSettings.compress ? ".min" : "") + '.css'] = output.css;
            if (!--pending) callback(null, css);
          });
        });
      } else {
        pending--;
      }
    });
  });
};
