# skellyjs

skellyjs framework

![skellyjs](https://avatars3.githubusercontent.com/u/14166772?v=3&s=200)

[![npm version](https://badge.fury.io/js/skellyjs.svg)](http://badge.fury.io/js/skellyjs)
[![travis test](https://travis-ci.org/skellyjs/skellyjs.svg?branch=master)](https://travis-ci.org/skellyjs/skellyjs)
[![Coverage Status](https://coveralls.io/repos/skellyjs/skellyjs/badge.svg?branch=master&service=github)](https://coveralls.io/github/skellyjs/skellyjs?branch=master)

# Quick Start
### Install the [Generator](https://npmjs.com/package/generator-skellyjs)

```bash
$ npm install -g generator-skellyjs
```

### Create the app:

```bash
$ skelly /tmp/project && cd /tmp/project
```

### Install dependencies:

```bash
$ npm install
```

### Start the app

```bash
$ npm start
```

# Creating Pages

The built in router will automatically look for a controller named the same as the url path.  The index controller is used for /. To create a */help* page, just create a controller named *help.js*.

# HTML Views

The built in templating engine is [swig](http://paularmstrong.github.io/swig/).  Your views should go into the */views* folder.  Javascript (*/javascripts* )and CSS (*/stylesheets*) includes will be read into memory.  You can hash javascript, css, or images using a skelly swig filter.

```html
<script src="/javascripts/{{'index.min.js'|hash}}"></script>
<link rel="stylesheet" href="/stylesheets/{{'index.min.css'|hash}}">
<img src="/images/{{'shelby.jpg'|hash}}" />
```
Example output:
```html
<script src="/javascripts/index.min.e0df532694.js"></script>
<link rel="stylesheet" href="/stylesheets/index.min.e0df532694.css">
<img src="/images/shelby.e0df532694.jpg'" />
```

The system will automatically return the current file for any hash.

# Javascript Files

The javascript files are read into memory on load.  Required files are not combined into a single file, but that feature is coming.  They are, however, minified using [Uglify-JS](https://github.com/mishoo/UglifyJS2).

# CSS Files

The built in CSS precompiler is [LESS](http://lesscss.org).  I suggest you create a single less file for each view (*/stylesheets*), and include global less files (*/stylesheets/includes*) as needed:
```less
/* index.less */
@import 'global';
```

# Logging

To log something to stdout, there's a built in method (using [bunyan](https://github.com/trentm/node-bunyan)).  You can simply call ```skelly.log.<level>('Hello!')```.
```level``` can be (from most severe to least):
   * fatal
   * error
   * warn
   * info
   * debug
   * trace

By default (development mode), debug and higher are output, while trace is ignored.  In production (```NODE_ENV=production```), info and higher are output, while debug and trace are ignored.  You can set an environment variable to set the log level ```LOGLEVEL=trace```.

# Custom Installation

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




## License

  [MIT](LICENSE)
