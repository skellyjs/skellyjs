module.exports = function(skelly, expect) {
  describe('Helpers', function() {
    it('isValidEmail(skelly@skellyjs.com) should return true', function() {
      expect(skelly.helpers.isValidEmail('skelly@skellyjs.com')).to.be.true;
    });
    it('isValidEmail(abc@123) should return false', function() {
      expect(skelly.helpers.isValidEmail('abc@123')).to.be.false;
    });
  });
};