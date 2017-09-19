var http = require('http'); // http server
var skelly = require('skellyjs'); // skellyjs framework

// create the server
var server = http.createServer(function(req, res) {
  skelly.router(req,res);
});

// accept incoming traffic
server.listen(process.env.PORT || 4000);
skelly.log.debug('Listening on port:', server.address().port);
skelly.log.debug('Hash:', skelly.hash);
