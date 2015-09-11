# skellyjs

skellyjs framework

![skellyjs](https://avatars3.githubusercontent.com/u/14166772?v=3&s=200)

[![npm version](https://badge.fury.io/js/skellyjs.svg)](http://badge.fury.io/js/skellyjs)
[![travis test](https://travis-ci.org/skellyjs/skellyjs.svg?branch=master)](https://travis-ci.org/skellyjs/skellyjs)
[![Coverage Status](https://coveralls.io/repos/skellyjs/skellyjs/badge.svg?branch=master&service=github)](https://coveralls.io/github/skellyjs/skellyjs?branch=master)

## Table of Contents

  1. [Quick Start](#quick-start)
  1. [Creating Pages (Controllers)](#creating-pages-controllers)
  1. [Models](#models)
  1. [HTML Views](#html-views)
  1. [Client-side Javascript Files](#client-side-javascript-files)
  1. [CSS Files](#css-files)
  1. [Logging](#logging)
  1. [Custom Installation](#custom-installation)
  1. [Node.js Style Guide](#nodejs-style-guide)
  1. [License](#license)

## Quick Start
#### Install the [Generator](https://npmjs.com/package/generator-skellyjs)

```bash
$ npm install -g generator-skellyjs
```

#### Create the app:

```bash
$ skelly /tmp/project && cd /tmp/project
```

#### Install dependencies:

```bash
$ npm install
```

#### Start the app

```bash
$ npm start
```
**[⬆ back to top](#table-of-contents)**

## Creating Pages (Controllers)

The built in router will automatically look for a controller named the same as the url path.  The index controller is used for /. To create a */help* page, just create a controller named *help.js*.  Index and 404 controller examples are in /controllers.

**[⬆ back to top](#table-of-contents)**

## Models

To connecto to your [MongoDB](), make sure to set process.env.DB_HOST, process.env.DB_NAME, process.env.DB_USER, and process.env.DB_PASSWORD.  [DotEnv](https://github.com/motdotla/dotenv) is built into skelly, so if you create a .env file in your application's root, you should set these values there.  A .env example file is in the root.

```yaml
# Database host(s) comma separated (10.0.0.1,10.0.0.2)
DB_HOST=localhost

# Database Name
DB_NAME=skelly

# Database user
DB_USER=user

# Database password
DB_PASSWORD=pass
```

[Mongoose](http://mongoosejs.com) models should be included in your controller by passing in the skelly object.  You can use the built in skelly variables for appRoot and modelsRoot.  An index model example is in /models.

```javascript
var Index = require(path.join(skelly.appRoot,skelly.modelsRoot,'index'))(skelly);
```
The model itself is constructed just like all other Mongoose models, but using the skelly.mongoose object (instead of including the mongoose library)

```javascript
module.exports = function(skelly) {
  return skelly.mongoose.model(

    // name of your model (http://mongoosejs.com/docs/models.html)
    'Test',

    // schema (http://mongoosejs.com/docs/schematypes.html)
    {
      title : {
        type: String,
        required: true
      }
    }
  );
};
```

**[⬆ back to top](#table-of-contents)**

## HTML Views

The built in templating engine is [swig](http://paularmstrong.github.io/swig/).  Your views should go into the */views* folder.  Javascript (*/javascripts* )and CSS (*/stylesheets*) includes will be read into memory.  You can hash javascript, css, or images using a skelly swig filter. Index and 404 views, plus a main layout, examples are in /views (and /views/layouts).

```html
<script src="/javascripts/{{'index.min.js'|hash}}"></script>
<link rel="stylesheet" href="/stylesheets/{{'index.min.css'|hash}}" />
<img src="/images/{{'shelby.jpg'|hash}}" />
```
Example output:
```html
<script src="/javascripts/index.min.e0df532694.js"></script>
<link rel="stylesheet" href="/stylesheets/index.min.e0df532694.css" />
<img src="/images/shelby.e0df532694.jpg'" />
```

The system will automatically return the current file for any hash.

**[⬆ back to top](#table-of-contents)**

## Client-side Javascript Files

The javascript files are read into memory on load.  Required files are not combined into a single file, but that feature is coming.  They are, however, minified using [Uglify-JS](https://github.com/mishoo/UglifyJS2).  An index javascript example file is located in /javascripts

**[⬆ back to top](#table-of-contents)**

## CSS Files

The built in CSS precompiler is [LESS](http://lesscss.org).  I suggest you create a single less file for each view (*/stylesheets*), and include global less files (*/stylesheets/includes*) as needed.  An index less file, and several includes, are located in /stylesheets (and /styplesheets/includes)
```less
/* index.less */
@import 'global';
```

**[⬆ back to top](#table-of-contents)**

## Logging

To log something to stdout, there's a built in method (using [bunyan](https://github.com/trentm/node-bunyan)).  You can simply call ```skelly.log.<level>('Hello!')```.
```level``` can be (from most severe to least):
   * fatal
   * error
   * warn
   * info
   * debug
   * trace

By default (development mode), debug and higher are output, while trace is ignored.  In production (```NODE_ENV=production```), info and higher are output, while debug and trace are ignored.  You can set an environment variable to set the log level ```LOGLEVEL=trace```.

**[⬆ back to top](#table-of-contents)**

## Custom Installation

If you'd like to install the framework into your own app:

```sh
$ npm install skellyjs --save
```

In your main script:

```javascript
/* app.js */
var http = require('http'); // http server
var skelly = require('skellyjs'); // skellyjs framework

// generate the css
skelly.generateCss();
// generate the javascript
skelly.generateJs();

// create the server
var server = http.createServer(function(req, res) {
  skelly.router(req,res);
});

// accept incoming traffic
server.listen(process.env.PORT || 4000);
skelly.log.debug('Listening on port:', server.address().port);
skelly.log.debug("Hash:",skelly.hash);
```

**[⬆ back to top](#table-of-contents)**

## Node.js Style Guide
[NODESTYLEGUIDE](NODESTYLEGUIDE.md)

**[⬆ back to top](#table-of-contents)**

## License

  [MIT](LICENSE)

**[⬆ back to top](#table-of-contents)**
