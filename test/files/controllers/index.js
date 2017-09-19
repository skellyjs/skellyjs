module.exports = function(skelly, req, res) {
  // the view file in /views
  var viewFile = 'index.html';

  // include the index model
  var Index = skelly.models.index;

  // find any single entry in the index model
  Index.findOne({}, function(err, index) {
    if (err) {
      skelly.log.error(err);
      res.end(err);
    } else {

      // if no entry, just pass a static title
      if (!index) {
        var newTest = {title:'Hello, my name is Shelby!'};
        var saveTest = new Index(newTest);
        saveTest.save(function(saveErr, savedTest) {
          skelly.log.debug('Saving to db: ', newTest);
          if (saveErr) skelly.intLog.error(saveErr);
          Index.remove({title:'Hello, my name is Shelby!'}, function(deleteErr) {
            skelly.log.debug('Removing from db');
            if (deleteErr) skelly.intLog.error(deleteErr);
            skelly.render(req, res, viewFile, savedTest);
          });
        });
        // if there's an entry, pass it to use as the title
      } else {
        skelly.render(req, res, viewFile, index);
      }
    }
  });
};