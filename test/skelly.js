var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;

var skelly = require('../skelly');

skelly.controllersRoot = 'test/files/controllers';
skelly.htrootRoot = 'test/files/htroot';
skelly.imagesRoot = 'test/files/images';
skelly.javascriptsRoot = 'test/files/javascripts';
skelly.modelsRoot = 'test/files/models';
skelly.stylesheetsRoot = 'test/files/stylesheets';
skelly.viewsRoot = 'test/files/views';

skelly.init();

describe('Skelly', function() {
  require('./main.js')(skelly, expect);
  require('./router.js')(skelly, expect);
  require('./helpers.js')(skelly, expect);
});