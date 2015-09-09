module.exports = function(skelly, req, res) {
  // the view file in /views
  var viewFile = "index.html";

  // data that you want to pass into the view
  var data = {
    
  };

  skelly.render(req, res, viewFile, data);
};