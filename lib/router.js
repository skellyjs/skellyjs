var fs = require('fs'); // file system library to read/write files
var mime = require('mime'); // map file extensions to content type
var morgan = require('morgan'); // I/O logger
var path = require('path'); // path library to help manipulate paths
var url = require('url'); // url library to manipulate the requested url

/*
 * Render a Page
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {string} thisPath - the path as a string (/, /admin, etc.)
 */
var renderPage = function(skelly, req, res, thisPath) {
  // if looking for root, use the index controller
  if (thisPath === '/') thisPath = 'index';
  var thisController = path.join(skelly.appRoot,skelly.controllersRoot,thisPath);

  // check to see if there is a controller for the requested url
  if (fs.existsSync(thisController + '.js')) {
    require(thisController)(skelly, req, res);
  // 404 catch all
  } else {
    render404(skelly, req, res);
  }
};

/*
 * Render a CSS File
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {string} thisPath - the path as a string (/stylesheets/index.min.12345.css)
 */
var renderCSSFile = function(skelly, req, res, thisPath) {
  // find the requested hash so we can abstract the file name
  var requestHash = /\/stylesheets\/(.*?\.)*/;
  var thisHash = thisPath.match(requestHash)[1].replace('.','');

  // get only the file name
  var thisFile = thisPath.replace('/stylesheets/','').replace('.'+thisHash,'');

  // if it's in the object, serve the contents
  if (skelly.css[thisFile]) {
    // set the response header to 200 (ok) and the content type to css
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(skelly.css[thisFile], 'utf8'),
      'Content-Type': 'text/css'
    });
    res.end(skelly.css[thisFile], 'utf8');

  // 404 not found
  } else {
    render404(skelly, req, res);
  }
};

/*
 * Render a Javascript File
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {string} thisPath - the path as a string (/javascripts/index.min.12345.js)
 */
var renderJSFile = function(skelly, req, res, thisPath) {
  var requestHash,thisHash,thisFile;

  // if isDevel, if so, show map files
  if (skelly.isDevel && thisPath.substring(thisPath.length-7, thisPath.length) === ".js.map") {
    // find the requested hash so we can abstract the file name
    requestHash = /\/javascripts\/.*min.(.*?)\.js\.map$/;
    thisHash = thisPath.match(requestHash)[1].replace('.','');
    
    // get the filename without the hash
    thisFile = thisPath.replace('/javascripts/','').replace('.'+thisHash,'').split('.map')[0];

    if (skelly.js[thisFile]) {
      // set the response header to 200 (ok) and the content type to css
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(skelly.js[thisFile].map, 'utf8'),
        'Content-Type': 'text/javascript'
      });
      res.end(skelly.js[thisFile].map, 'utf8');

    // 404 not found
    } else {
      render404(skelly, req, res);
    }
  // if isDevel and looking for the source file
  } else if (skelly.isDevel && thisPath.indexOf('.min') < 0) {
    renderStaticFile(skelly, req, res, path.join(skelly.appRoot,skelly.javascriptsRoot), thisPath.split('/javascripts')[1], false);
  // else, send the javascript file
  } else {
    // find the requested hash so we can abstract the file name
    requestHash = /\/javascripts\/(.*?\.)*/;
    thisHash = thisPath.match(requestHash)[1].replace('.','');

    // get only the file name
    thisFile = thisPath.replace('/javascripts/','').replace('.'+thisHash,'');
    // if it's in the object, serve the contents
    if (skelly.js[thisFile]) {
      // set the response header to 200 (ok) and the content type to css
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(skelly.js[thisFile].code, 'utf8'),
        'Content-Type': 'text/javascript'
      });
      res.end(skelly.js[thisFile].code, 'utf8');

    // 404 not found
    } else {
      render404(skelly, req, res);
    }
  }
};

/*
 * Render a Image File
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {string} thisPath - the path as a string (/images/shelby.jpg)
 */
var renderImageFile = function(skelly, req, res, thisPath) {
  // find the requested hash so we can abstract the file name
  var requestHash = /\/images\/(.*?\.)*/;
  var thisHash = thisPath.match(requestHash)[1].replace('.','');

  var dir = path.join(skelly.appRoot,skelly.imagesRoot);

  // get only the file name
  var thisFile = thisPath.replace('/images/','').replace('.'+thisHash,'');
  thisFile = path.join(dir,thisFile);
  
  if (fs.existsSync(thisFile)) {
    var stat = fs.statSync(thisFile);

    fs.readFile(thisFile, 'utf8', function(err, fileContent) {
      if (err) throw err;
      // set the response header to 200 (ok) and the content type to css
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': mime.lookup(thisFile)
      });
      fs.createReadStream(thisFile, 'utf-8').pipe(res);
    });
  } else {
    render404(skelly, req, res);
  }
};

/*
 * Render a Static File
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {string} thisPath - the path as a string (/robots.txt)
 * @param {bool} binary - if the file is binary, we need to handle it differently
 */
var renderStaticFile = function(skelly, req, res, dir, thisPath, binary) {
  if (fs.existsSync(dir+thisPath)) {
    // get statistics about the file
    var stat = fs.statSync(dir+thisPath);
    // read the file content
    fs.readFile(dir+thisPath, 'utf8', function(err, fileContent) {
      if (err) throw err;
      // write the header (status code, file size and content type)
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': mime.lookup(dir+thisPath)
      });
      // if the file is binary, stream the file to the response
      if (binary) {
        fs.createReadStream(dir+thisPath, 'utf-8').pipe(res);
      // send the ascii file and end the connection
      } else {
        res.end(fileContent);
      }
    });
  // if the file doesn't exist, 404
  } else {
    render404(skelly, req, res);
  }
};

/*
 * Render the 404 page
 * @param {object} req - request object
 * @param {object} res - response object
 */
var render404 = function(skelly, req, res) {
  if(fs.existsSync(path.join(skelly.appRoot,skelly.controllersRoot,'404'))) {
    require(path.join(skelly.appRoot,skelly.controllersRoot,'404'))(skelly, req, res);
  } else {
    res.writeHead(404);
    res.end();
  }
};


/*
 * Check if request is a static file
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {string} thisPath - the path as a string (/robots.txt, /, /admin, etc.)
 */
var checkStatic = function(skelly, req, res, thisPath, callback) {
  var stat = fs.existsSync(path.join(skelly.appRoot,skelly.htrootRoot,thisPath));
  // return true if the file exists in /htroot, and the path is not /
  return callback(stat && thisPath !== "/");
};


module.exports = function(skelly, req, res) {
  // I/O logger, show dev logging if isDevel
  var logger = morgan(skelly.isDevel ? 'dev' : 'combined');

  logger(req, res, function (err) {
    if (err) throw err;
    // get the requested url
    req.requrl = url.parse(req.url, true);
    // get the path
    var thisPath = req.requrl.pathname;

    // handle css files
    if (/^\/stylesheets\/.*css/.test(thisPath)) {
      renderCSSFile(skelly, req, res, thisPath);
    // handle javascript files
    } else if (/^\/javascripts\/.*js/.test(thisPath)) {
      renderJSFile(skelly, req, res, thisPath);
    // handle images files
    } else if (/^\/images\/.*/.test(thisPath)) {
      renderImageFile(skelly, req, res, thisPath);
    } else {
      // check to see if the requested url is in /htroot
      checkStatic(skelly, req, res, thisPath, function(isStatic) {
        // it's a static file in /htroot, so render it
        if (isStatic) {
          renderStaticFile(skelly, req, res, path.join(skelly.appRoot,skelly.htrootRoot), thisPath, false);
        // it's not a static file, so it must be a dynamic page to render
        } else {
          renderPage(skelly, req, res, thisPath);
        }
      });
    }
  });
};