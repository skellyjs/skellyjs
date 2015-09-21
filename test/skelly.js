var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;

process.env.DB_HOST='localhost,127.0.0.1';
process.env.DB_NAME='skelly';
process.env.DB_USER='skelly';
process.env.DB_PASSWORD='test';

var http = require('http'); // http server
var request = require('supertest');
var skelly = require('../skelly');
var port = 4001;
request = request('http://localhost:'+port);
describe('Skelly', function() {
  describe('Main', function() {
    it('should return an object', function() {
      expect(skelly).to.be.an('object');
    });
    it('should contain a logger', function() {
      expect(skelly.log).to.be.an('object');
    });
  });
  describe('Router', function() {
    skelly.controllersRoot = 'test/files/controllers';
    skelly.htrootRoot = 'test/files/htroot';
    skelly.imagesRoot = 'test/files/images';
    skelly.javascriptsRoot = 'test/files/javascripts';
    skelly.modelsRoot = 'test/files/models';
    skelly.stylesheetsRoot = 'test/files/stylesheets';
    skelly.viewsRoot = 'test/files/views';

    skelly.init();

    // create the server
    var server = http.createServer(function(req, res) {
      skelly.router(req,res);
    });

    // accept incoming traffic
    server.listen(port);

    describe('Page (/)', function(){
      it('should return a page',function(done){
        var data;
        request.get('/')
          .expect(200)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            expect(data.header).to.contain({'content-type' : 'text/html'});
            expect(data.text).to.contain('<h1>Hello, my name is Shelby!</h1>');
            done();
          });
      });
    });

    describe('404 Page (/asdf)', function(){
      it('should return a 404 error',function(done){
        var data;
        request.get('/asdf')
          .expect(404)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            done();
          });
      });
    });

    describe('CSS (/stylesheets/index.min.asdf.css)', function(){
      it('should return a css file',function(done){
        var data;
        request.get('/stylesheets/index.min.asdf.css')
          .expect(200)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            expect(data.header).to.contain({'content-type' : 'text/css'});
            expect(data.text).to.contain('github.com/necolas/normalize.css */html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}');
            done();
          });
      });
    });

    describe('404 CSS (/stylesheets/asdf.min.asdf.css)', function(){
      it('should return a 404 error',function(done){
        var data;
        request.get('/stylesheets/asdf.min.asdf.css')
          .expect(404)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            done();
          });
      });
    });

    describe('JS (/javascripts/index.min.asdf.js)', function(){
      it('should return a js file',function(done){
        var data;
        request.get('/javascripts/index.min.asdf.js')
          .expect(200)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            expect(data.header).to.contain({'content-type' : 'text/javascript'});
            expect(data.text).to.contain('sourceMappingURL=/test/files/javascripts/index.min.');
            done();
          });
      });
    });

    describe('JS Map (/javascripts/index.min.asdf.js.map)', function(){
      it('should return a js file',function(done){
        var data;
        request.get('/javascripts/index.min.asdf.js.map')
          .expect(200)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            expect(data.header).to.contain({'content-type' : 'text/javascript'});
            done();
          });
      });
    });

    describe('JS Source (/javascripts/index.js)', function(){
      it('should return a js file',function(done){
        var data;
        request.get('/javascripts/index.js')
          .expect(200)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            expect(data.header).to.contain({'content-type' : 'application/javascript'});
            done();
          });
      });
    });

    describe('404 JS (/javascripts/asdf.min.asdf.js)', function(){
      it('should return a 404 error',function(done){
        var data;
        request.get('/javascripts/asdf.min.asdf.js')
          .expect(404)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            done();
          });
      });
    });

    describe('404 JS Map (/javascripts/asdf.min.asdf.js.map)', function(){
      it('should return a 404 error',function(done){
        var data;
        request.get('/javascripts/asdf.min.asdf.js.map')
          .expect(404)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            done();
          });
      });
    });

    describe('Image (/images/shelby.asdf.jpg)', function(){
      it('should return an image',function(done){
        var data;
        request.get('/images/shelby.asdf.jpg')
          .expect(200)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            expect(data.header).to.contain({'content-type' : 'image/jpeg'});
            done();
          });
      });
    });

    describe('404 Image (/images/asdf.asdf.jpg)', function(){
      it('should return a 404 error',function(done){
        var data;
        request.get('/images/asdf.asdf.jpg')
          .expect(404)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            done();
          });
      });
    });

    describe('Static File (/htroot/robots.txt)', function(){
      it('should return a text file',function(done){
        var data;
        request.get('/robots.txt')
          .expect(200)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            expect(data.header).to.contain({'content-type' : 'text/plain'});
            expect(data.text).to.contain('# www.robotstxt.org/');
            done();
          });
      });
    });

    describe('Static Binary File (/htroot/favicon.ico)', function(){
      it('should return a text file',function(done){
        var data;
        request.get('/favicon.ico')
          .expect(200)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            expect(data.header).to.contain({'content-type' : 'image/x-icon'});
            done();
          });
      });
    });

    describe('404 Static File (/htroot/asdf.txt)', function(){
      it('should return a 404 error',function(done){
        var data;
        request.get('/asdf.txt')
          .expect(404)
          .expect(function(res) {
            data = res;
          })
          .end(function() {
            done();
          });
      });
    });


  });
});