module.exports = function(skelly, expect) {
  describe('Main', function() {
    it('should return an object', function() {
      expect(skelly).to.be.an('object');
    });
    it('should contain a logger', function() {
      expect(skelly.log).to.be.an('object');
    });
    it('should set/get a value', function() {
      skelly.set('happy','joy');
      expect(skelly.get('happy')).to.equal('joy');
    });
  });
};