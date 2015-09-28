var path = require('path'); // path library to help manipulate paths
var swig = require('swig'); // templating engine

/*
 * Render a page
 * @param <object> skelly - skelly object
 * @param <object> req - request object
 * @param <object> res - response object
 * @param <string> view - view file name, based on the skelly.viewsRoot path
 * @param <object> data - data to be passed into the view
 * @param <number> statusCode - status code to send in the header (optional)
 */
module.exports = function(skelly, req, res, view, data, statusCode) {
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
    res.statusCode = typeof statusCode === 'number' ? statusCode : 200;

    res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
    res.setHeader('Content-Type', 'text/html');

    // send the response and end the connection
    res.end(content);
  });
};