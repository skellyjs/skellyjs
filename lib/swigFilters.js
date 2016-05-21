'use strict';

var path = require('path'); // path library to help manipulate paths
var skelly = require(path.join('..','skelly'));

module.exports = {
  // function to include custom swig filters
  inc : function(swig, callback) {
    // hash filter to add the global hash after '.min' to the filename
    // example: <link rel="stylesheet" href="/stylesheets/{{'index.min.css'|hash}}">
    // results: <link rel="stylesheet" href="/stylesheets/index.min.10975f1d97.css">
    swig.setFilter('hash', function (input) {

      var requestHash = /^.*\.(.*)$/;
      var thisExt = input.match(requestHash)[1];

      var newName = input.substring(0,input.length-thisExt.length) + skelly.hash+'.'+thisExt;
      return newName;
    });
    return callback(swig);
  }
};
