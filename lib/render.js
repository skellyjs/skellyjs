var path = require('path'); // path library to help manipulate paths
var swig = require('swig'); // templating engine

module.exports = function(skelly, req, res, view, data) {
  // set swig cache (false if development, otherwise true)
  if (skelly.isDevel) {
    swig.setDefaults({ cache: false });
  }
  // get custom swig filters library
  var swigFilters = require(path.join(skelly.moduleRoot,'lib','swigFilters'));

  // include custom swig filters
  swigFilters.inc(swig, function(swig) {

    // compile the template
    var template = swig.compileFile(path.join(skelly.appRoot,skelly.viewsRoot,view));
    // inject the variable data
    var content = template(data);
    // write the response header (size of the file, content type)
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(content, 'utf8'),
      'Content-Type': 'text/html'
    });

    // send the response and end the connection
    res.end(content);
  });
};