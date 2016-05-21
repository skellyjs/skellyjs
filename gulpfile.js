'use strict';

var git = require('gulp-git');
var gulp = require('gulp');

/*
 * Release Tasks
 */

// Git Tag
gulp.task('publish:tag', function(done) {
  // get the version from package.json
  var pkg = JSON.parse(require('fs').readFileSync('./package.json'));

  // prepend the 'v'
  var v = 'v' + pkg.version;

  // Tag message
  var message = 'Release ' + v;

  // tag the current commit
  git.tag(v, message, function (err) {
    if (err) { throw err; }

    // push to origin
    git.push('origin', v, function (pushErr) {
      if (pushErr) { throw pushErr; }
      done();
    });
  });
});

// NPM Publish
gulp.task('publish:npm', function(done) {
  // get the npm child process
  require('child_process')
    // spawn another npm process with the command of publish
    .spawn('npm', ['publish'], { stdio: 'inherit' })
    .on('close', done);
});

// Expose a single command to git tag and npm publish
gulp.task('release', ['publish:tag', 'publish:npm']);
