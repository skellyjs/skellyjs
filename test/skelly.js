var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;

var skelly = require('../skelly');

describe('Skelly', function() {
  describe('Main', function() {
    it('should return an object', function() {
      expect(skelly).to.be.an('object');
    });
  });
});