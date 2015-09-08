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

# Installation

If you'd like to install the framework by itself...

```sh
npm install skellyjs
```



## License

  [MIT](LICENSE)
