module.exports = function(skelly) {
  return skelly.mongoose.model(

    // name of your model (http://mongoosejs.com/docs/models.html)
    'Test',

    // schema (http://mongoosejs.com/docs/schematypes.html)
    {
      title : String
    }
  );
};