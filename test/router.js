module.exports = function(skelly, expect) {
  var http = require('http'); // http server
  var request = require('supertest');
  var port = 4001;
  request = request('http://localhost:'+port);

  describe('Router', function() {

    // create the server
    var server = http.createServer(function(req, res) {
      skelly.router(req,res);
    });

    // accept incoming traffic
    server.listen(port);

    describe('Page (/)', function(){
      it('should return a page',function(done){
        request.get('/')
          .expect(200)
          .expect('Content-Type', 'text/html')
          .end(function(err, data) {
            if (err) throw err;
            expect(data.text).to.contain('<h1>Hello, my name is Shelby!</h1>');
            done();
          });
      });
    });

    describe('404 Page (/asdf)', function(){
      it('should return a 404 error',function(done){
        request.get('/asdf')
          .expect(404)
          .end(function() {
            done();
          });
      });
    });

    describe('CSS (/stylesheets/index.min.asdf.css)', function(){
      it('should return a css file',function(done){
        request.get('/stylesheets/index.min.asdf.css')
          .expect(200)
          .expect('Content-Type', 'text/css')
          .end(function(err, data) {
            if (err) throw err;
            expect(data.text).to.contain('github.com/necolas/normalize.css */html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}');
            done();
          });
      });
    });

    describe('404 CSS (/stylesheets/asdf.min.asdf.css)', function(){
      it('should return a 404 error',function(done){
        request.get('/stylesheets/asdf.min.asdf.css')
          .expect(404)
          .end(function() {
            done();
          });
      });
    });

    describe('JS (/javascripts/index.min.asdf.js)', function(){
      it('should return a js file',function(done){
        request.get('/javascripts/index.min.asdf.js')
          .expect(200)
          .expect('Content-Type', 'text/javascript')
          .end(function(err, data) {
            if (err) throw err;
            expect(data.text).to.contain('sourceMappingURL=/test/files/javascripts/index.min.');
            done();
          });
      });
    });

    describe('JS Map (/javascripts/index.min.asdf.js.map)', function(){
      it('should return a js file',function(done){
        request.get('/javascripts/index.min.asdf.js.map')
          .expect(200)
          .expect('Content-Type', 'text/javascript')
          .end(function() {
            done();
          });
      });
    });

    describe('JS Source (/javascripts/index.js)', function(){
      it('should return a js file',function(done){
        request.get('/javascripts/index.js')
          .expect(200)
          .expect('Content-Type', 'text/javascript')
          .end(function() {
            done();
          });
      });
    });

    describe('404 JS (/javascripts/asdf.min.asdf.js)', function(){
      it('should return a 404 error',function(done){
        request.get('/javascripts/asdf.min.asdf.js')
          .expect(404)
          .end(function() {
            done();
          });
      });
    });

    describe('404 JS Map (/javascripts/asdf.min.asdf.js.map)', function(){
      it('should return a 404 error',function(done){
        request.get('/javascripts/asdf.min.asdf.js.map')
          .expect(404)
          .end(function() {
            done();
          });
      });
    });

    describe('Image (/images/shelby.asdf.jpg)', function(){
      it('should return an image',function(done){
        request.get('/images/shelby.asdf.jpg')
          .expect(200)
          .expect('Content-Type', 'image/jpeg')
          .end(function() {
            done();
          });
      });
    });

    describe('404 Image (/images/asdf.asdf.jpg)', function(){
      it('should return a 404 error',function(done){
        request.get('/images/asdf.asdf.jpg')
          .expect(404)
          .end(function() {
            done();
          });
      });
    });

    describe('Static File (/htroot/robots.txt)', function(){
      it('should return a text file',function(done){
        request.get('/robots.txt')
          .expect(200)
          .expect('Content-Type', 'text/plain')
          .end(function(err, data) {
            if (err) throw err;
            expect(data.text).to.contain('# www.robotstxt.org/');
            done();
          });
      });
    });

    describe('Static Binary File (/htroot/favicon.ico)', function(){
      it('should return a text file',function(done){
        request.get('/favicon.ico')
          .expect(200)
          .expect('Content-Type', 'image/x-icon')
          .end(function() {
            done();
          });
      });
    });

    describe('404 Static File (/htroot/asdf.txt)', function(){
      it('should return a 404 error',function(done){
        request.get('/asdf.txt')
          .expect(404)
          .end(function() {
            done();
          });
      });
    });
  });
};