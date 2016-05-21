'use strict';

var fs = require('fs'); // file system library to read/write files
var less = require('less'); // less compiler library
var path = require('path'); // path library to help manipulate paths

module.exports = function (skelly, callback) {
  // set the base directory to look for less files
  var dir = path.join(skelly.appRoot, skelly.stylesheetsRoot);

  var settings = {
    paths        : [path.join(dir,'includes')],    // .less file search paths for @imports
    outputDir    : path.join(dir,'css'),           // output directory
    optimization : 1,                              // optimization level, higher is better but more volatile - 1 is a good value
    compress     : true,                           // compress?
    yuicompress  : true                            // use YUI compressor?
  };

  var css = {};
  // find all the files in /stylesheets
  skelly.helpers.walk(dir, function(err, files) {
    /* istanbul ignore if */
    if (err) {
      skelly.intLog.error(err);
      callback(err);
    } else {
      var pending = files.length;

      files.forEach(function(file) {
        // grab the defaule settings
        var thisSettings = settings;

        // only process files that end in .less
        if (file.substring(file.length-5,file.length) === '.less' && file.indexOf('includes') < 0) {
          // read the file
          fs.readFile(file, 'utf8', function(err, fileContent) {
            /* istanbul ignore if */
            if (err) {
              skelly.intLog.error(err);
              callback(err);
            } else {
              // convert the read buffer into a string
              var cssString = fileContent.toString();
              // set the filename in the settings
              thisSettings.filename = file;

              // compile the less file to css
              less.render(cssString, thisSettings, function(err, output) {
                /* istanbul ignore if */
                if (err) {
                  skelly.intLog.error(err);
                  callback(err);
                } else {
                  // save the css to the css object
                  css[file.split(dir+'/')[1].split('.less')[0] + (thisSettings.compress ? '.min' : /* istanbul ignore next */ '') + '.css'] = output.css;
                  /* istanbul ignore else */
                  if (!--pending) callback(null, css);
                }
              });
            }
          });
        } else {
          pending--;
        }
      });
    }
  });
};
