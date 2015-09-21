var path = require('path'); // path library to help manipulate paths

module.exports = function(skelly, callback) {
  // generate the mongoURI for the connection to the database using an array of strings (and join them at the end)
  var mongoURI = [];
  // add the protocol at the beginning
  mongoURI.push('mongodb://');

  // split the host(s) value on comma
  var dbHosts = process.env.DB_HOST.split(',');
  // iterate over the host(s)
  for(var i=0;i<dbHosts.length;i++) {
    // if a user is specified, add it
    if (process.env.DB_USER) {
      mongoURI.push(process.env.DB_USER.trim());

      // if a password is specified, add it as 'user:password'
      if (process.env.DB_PASSWORD) {
        mongoURI.push(':' + process.env.DB_PASSWORD.trim());
      }
      // add the @ (between the user(:password)@host)
      mongoURI.push('@');
    }

    // add the host
    mongoURI.push(dbHosts[i].trim());

    // if it's not the last entry, add a comma
    if (i !== dbHosts.length-1) {
      mongoURI.push(',');
    }
  }
  // add the /databaseName
  mongoURI.push('/' + process.env.DB_NAME.trim());

  // join the array into a string
  skelly.mongoURI = mongoURI.join('');

  skelly.intLog.debug('Connecting to mongo:',skelly.mongoURI);
  skelly.mongoose = require('mongoose');
  // Connect to DB
  skelly.mongoose.connect(skelly.mongoURI);

  var dir = path.join(skelly.appRoot, skelly.modelsRoot);
skelly.intLog.info(dir);
  var models = {};
  // find all the files in /javascripts
  skelly.helpers.walk(dir, function(err, files) {
    if (err) {
      skelly.intLog.error(err);
      callback(err);
    } else {
      var pending = files.length;

      files.forEach(function(file) {
        // Import the model
        var fileName = file.split(dir + '/')[1].split('.js')[0];
        models[fileName] = require(path.join(skelly.appRoot,skelly.modelsRoot,fileName))(skelly);
        if (!--pending) callback(null, models);
      });
    }
  });

};