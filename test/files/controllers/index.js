var path = require('path');

module.exports = function(skelly, req, res) {
  // the view file in /views
  var viewFile = "index.html";

  // data that you want to pass into the view
  var Index = require(path.join(skelly.appRoot,skelly.modelsRoot,'index'))(skelly);
  Index.findOne({title:"Hello, my name is Shelby!"}, function(err, index) {

    if (err) {
      skelly.log.error(err);
      res.end(err);
    } else {
      if (!index) {
        index = new Index({title:"Hello, my name is Shelby!"});
        index.save(function(err, save) {
          if (err) {
            skelly.log.error(err);
            res.end(err);
          } else {
            skelly.render(req, res, viewFile, save);
          }
        });
      } else {
        skelly.render(req, res, viewFile, index);
      }
    }
  });
};