module.exports = function(skelly, req, res) {
  // the view file in /views
  var viewFile = "404.html";

  // data that you want to pass into the view
  var data = {
    path : req.requrl.path
  };

  skelly.render(req, res, viewFile, data);
};