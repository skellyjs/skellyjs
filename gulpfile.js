var git = require('gulp-git');
var gulp = require('gulp');

/**
 * Release Tasks
 */

gulp.task('publish:tag', function(done) {
  var pkg = JSON.parse(require('fs').readFileSync('./package.json'));
  var v = 'v' + pkg.version;
  var message = 'Release ' + v;

  git.tag(v, message, function (err) {
    if (err) throw err;
    git.push('origin', v, function (err) {
      if (err) throw err;
      done();
    });
  });
});

gulp.task('publish:npm', function(done) {
  require('child_process')
    .spawn('npm', ['publish'], { stdio: 'inherit' })
    .on('close', done);
});

gulp.task('release', ['publish:tag', 'publish:npm']);