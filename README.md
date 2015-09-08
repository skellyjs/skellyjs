# skellyjs
skellyjs framework

See [generator-skellyjs](https://npmjs.com/package/skellyjs) to scaffold a project

# Quick Start
### Install the Generator

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
