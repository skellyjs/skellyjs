var http = require('http'); // http server
var skelly = require('skellyjs'); // skellyjs framework

// set the environment from shell variable.  this changes things like api keys, logging, and other configurations (default to development)
var env = process.env.NODE_ENV || 'development';

// create the server
var server = http.createServer(function(req, res) {
  skelly.router(req,res);
});

// accept incoming traffic
server.listen(process.env.PORT || 4000);
skelly.log.debug('Listening on port:', server.address().port);
skelly.log.debug("Hash:",skelly.hash);
