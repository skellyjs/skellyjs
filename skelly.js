var bunyan = require('bunyan'); // log library to output to stdout
var crypto = require('crypto'); // hashing library
var http = require('http'); // http server
var mongoose = require('mongoose'); // mongoose (mongo connector)
var path = require('path'); // path library to help manipulate paths

// load .env file
require('dotenv').load();

// set the environment from shell variable.  this changes things like api keys, logging, and other configurations (default to development)
var env = process.env.NODE_ENV || 'development';

/**
 * Don't use process.cwd() as it breaks module encapsulation
 * Instead, let's use module.parent if it's present, or the module itself if there is no parent (probably testing directly if that's the case)
 * This way, the consuming app/module can be an embedded node_module and path resolutions will still work
 * (process.cwd() breaks module encapsulation if the consuming app/module is itself a node_module)
 */
// var moduleRoot = (function(_rootPath) {
//   var parts = _rootPath.split(path.sep);
//   parts.pop(); //get rid of /node_modules from the end of the path
//   return parts.join(path.sep);
// })(module.parent ? module.parent.paths[0] : module.paths[0]);

var moduleRoot = module.filename.split('skelly.js')[0];


var Skelly = function() {
  // set the app root
  this.appRoot = process.cwd();
  this.moduleRoot = moduleRoot;

  // convenience boolean to see if we're in development or not
  this.isDevel = env === 'development';

  // default root location for files
  this.controllersRoot = 'controllers';
  this.htrootRoot      = 'htroot';
  this.imagesRoot      = 'images';
  this.javascriptsRoot = 'javascripts';
  this.modelsRoot      = 'models';
  this.stylesheetsRoot = 'stylesheets';
  this.viewsRoot       = 'views';

  this.helpers = require(path.join(this.moduleRoot,'lib','helpers'));

  // read in the application's package.json
  this.pkg = require(path.join(this.appRoot, 'package.json'));

  /*
   * create the log instance.  to use, log.info() instead of console.log().  
   * also available (in order of severity (high to low)) are:
   *   log.fatal()
   *   log.error()
   *   log.warn()
   *   log.info()
   *   log.debug()
   *   log.trace()
   * in the CLI, when starting this app, pipe the node call to bunyan -o short (node app.js | bunyan -o short) for a more readable output
  */
  // this should be used in the application (skelly.log.<level>(msg))
  this.log = bunyan.createLogger({name: this.pkg.name});
  // if a shell variable has a set log level, use it
  if (process.env.LOGLEVEL) {
    this.log.level(process.env.LOGLEVEL);
  // otherwise, and we're in a development environment, set the log level to debug
  } else if (this.isDevel){
    this.log.level('debug');
  }

  // set up an internal logger for framework logs.  This adds "framework=Skelly" to the entry
  // this should be used for all logging within the framework (skelly.intLog.<level>(msg))
  this.intLog = this.log.child({framework: 'Skelly'});

  // set a global hash to be used until server is restarted
  this.hash = crypto.randomBytes(5).toString('hex');

};

// expose Skelly object
var skelly = module.exports = exports = new Skelly();

skelly.init = function() {
  // if database host and name are specified, include the mongoose library and connect the models
  if (process.env.DB_HOST && process.env.DB_NAME) {
    require(path.join(this.moduleRoot,'lib','mongoose'))(this, function(err, models) {
      skelly.models = models;
    });
  }

  // look for less files and compile them into memory
  require(path.join(skelly.moduleRoot,'lib','less'))(skelly, function(err, css) {
    skelly.css = css;
  });

  // look for javascript files and minify them and put them into memory
  require(path.join(skelly.moduleRoot,'lib','javascript'))(skelly, function(err, js) {
    skelly.js = js;
  });
};

// expose the router
skelly.router = function(req, res) {
  require(path.join(skelly.moduleRoot,'lib','router'))(skelly, req, res);
};

// expose the renderer
skelly.render = function(req, res, view, data, statusCode) {
  require(path.join(skelly.moduleRoot,'lib','render'))(skelly, req, res, view, data, statusCode);
};
