'use strict';

var bunyan = require('bunyan'); // log library to output to stdout
var crypto = require('crypto'); // hashing library
var path = require('path'); // path library to help manipulate paths

// load .env file
require('dotenv').load();

// set the environment from shell variable.  this changes things like api keys, logging, and other configurations (default to development)
/* istanbul ignore next */
var env = process.env.NODE_ENV || 'development';

var Skelly = function() {
  var _this = this;
  /* istanbul ignore next */
  _this.settings = _this.settings ? _this.settings : {};

  /*
   * Set function to save settings
   * @param {String} setting
   * @param {*} value
   */
  _this.set = function set(setting, value) {
    _this.settings[setting] = value;
  };

  /*
   * Get function to retrieve settings
   * @param {String} setting
   * @return {*} value
   */
  _this.get = function get(setting) {
    return _this.settings[setting];
  };

  // set the application's (the app that is using skelly) root
  _this.appRoot = process.cwd();

  // set skelly's (this module) root
  _this.moduleRoot = module.filename.split('skelly.js')[0];

  // convenience boolean to see if we're in development or not
  _this.isDevel = env === 'development';

  // default root location for files
  /* istanbul ignore next */
  _this.controllersRoot = _this.controllersRoot ? _this.controllersRoot : 'controllers';
  /* istanbul ignore next */
  _this.htrootRoot      = _this.htrootRoot      ? _this.htrootRoot      : 'htroot';
  /* istanbul ignore next */
  _this.imagesRoot      = _this.imagesRoot      ? _this.imagesRoot      : 'images';
  /* istanbul ignore next */
  _this.javascriptsRoot = _this.javascriptsRoot ? _this.javascriptsRoot : 'javascripts';
  /* istanbul ignore next */
  _this.modelsRoot      = _this.modelsRoot      ? _this.modelsRoot      : 'models';
  /* istanbul ignore next */
  _this.stylesheetsRoot = _this.stylesheetsRoot ? _this.stylesheetsRoot : 'stylesheets';
  /* istanbul ignore next */
  _this.viewsRoot       = _this.viewsRoot       ? _this.viewsRoot       : 'views';

  _this.helpers = require(path.join(_this.moduleRoot,'lib','helpers'));

  // read in the application's package.json
  _this.pkg = require(path.join(_this.appRoot, 'package.json'));

  /*
   * create the log instance.  to use, log.info() instead of console.log().
   * also available (in order of severity (high to low)) are:
   *   skelly.log.fatal()
   *   skelly.log.error()
   *   skelly.log.warn()
   *   skelly.log.info()
   *   skelly.log.debug()
   *   skelly.log.trace()
   * in the CLI, when starting this app, pipe the node call to bunyan -o short (node app.js | bunyan -o short) for a more readable output
   */
  // this should be used in the application (skelly.log.<level>(msg))
  _this.log = bunyan.createLogger({name: _this.pkg.name});
  // if a shell variable has a set log level, use it
  /* istanbul ignore next */
  if (process.env.LOGLEVEL) {
    /* istanbul ignore next */
    _this.log.level(process.env.LOGLEVEL);
  // otherwise, and we're in a development environment, set the log level to debug
  } else if (_this.isDevel){
    _this.log.level('debug');
  }

  // set up an internal logger for framework logs.  This adds "framework=Skelly" to the entry
  // this should be used for all logging within the framework (skelly.intLog.<level>(msg))
  _this.intLog = _this.log.child({framework: 'Skelly'});

  // set a global hash to be used until server is restarted
  _this.hash = crypto.randomBytes(5).toString('hex');

  // allow for setting db variables either by skelly.db_host = 'asdf', or an env (shell env or .env) DB_HOST=asdf.
  // Take in Order:                           FIRST                                            SECOND                     THIRD
  /* istanbul ignore next */
  _this.db_host       = _this.db_host       ? _this.db_host       : process.env.DB_HOST      ? process.env.DB_HOST      : undefined;
  /* istanbul ignore next */
  _this.db_name       = _this.db_name       ? _this.db_name       : process.env.DB_NAME      ? process.env.DB_NAME      : undefined;
  /* istanbul ignore next */
  _this.db_user       = _this.db_user       ? _this.db_user       : process.env.DB_USER      ? process.env.DB_USER      : undefined;
  /* istanbul ignore next */
  _this.db_password   = _this.db_password   ? _this.db_password   : process.env.DB_PASSWORD  ? process.env.DB_PASSWORD  : undefined;
};

// expose Skelly object
var skelly = module.exports = exports = new Skelly();

skelly.init = function() {
  // if database host and name are specified, include the mongoose library and connect the models
  /* istanbul ignore else */
  if (skelly.db_host && skelly.db_name) {
    require(path.join(skelly.moduleRoot,'lib','mongoose'))(skelly, function(err, models) {
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
