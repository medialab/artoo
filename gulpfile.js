var gulp = require('gulp'),
    artoo = require('gulp-artoo'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    qunit = require('gulp-qunit'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    webserver = require('gulp-webserver'),
    pkg = require('./package.json');

// Utilities
var jsFiles = [
  'src/artoo.js',
  'src/third_party/jquery.simulate.js',
  'src/artoo.beep.js',
  'src/artoo.settings.js',
  'src/artoo.helpers.js',
  'src/artoo.hooks.js',
  'src/artoo.browser.js',
  'src/artoo.console.js',
  'src/artoo.dependencies.js',
  'src/artoo.countermeasures.js',
  // 'src/methods/artoo.methods.cache.js',
  'src/methods/artoo.methods.sniffers.js',
  'src/methods/artoo.methods.ajaxSpider.js',
  'src/methods/artoo.methods.autoExpand.js',
  'src/methods/artoo.methods.autoScroll.js',
  'src/methods/artoo.methods.db.js',
  'src/methods/artoo.methods.instructions.js',
  // 'src/methods/artoo.methods.navigate.js',
  'src/methods/artoo.methods.save.js',
  'src/methods/artoo.methods.scrape.js',
  'src/methods/artoo.methods.store.js',
  // 'src/methods/artoo.methods.state.js',
  'src/methods/artoo.methods.ui.js',
  'src/artoo.init.js'
];

var chromeFiles = [
  'src/chrome/artoo.chrome.js'
];

var phantomjsFiles = [
  'src/phantomjs/artoo.phantom.js'
];

function lintFilter(i) {
  return !~i.indexOf('third_party');
}

// Testing
gulp.task('test', function() {
  return gulp.src('./test/unit.html')
    .pipe(replace(
      /<!-- START ARTOO IMPORTS -->[\s\S]*<!-- END ARTOO IMPORTS -->/g,
      ['<!-- START ARTOO IMPORTS -->'].concat(
        jsFiles.slice(0, -1).map(function(path) {
          return '  <script src="../' + path + '"></script>';
        })
      ).concat('  <!-- END ARTOO IMPORTS -->').join('\n')
    ))
    .pipe(gulp.dest('./test'))
    .pipe(qunit());
});

// Linting
gulp.task('lint', function() {
  var avoidFlags = {
    '-W055': true,
    '-W040': true,
    '-W064': true,
    '-W061': true,
    '-W103': true,
    '-W002': true
  };

  return gulp.src(jsFiles.filter(lintFilter))
    .pipe(jshint(avoidFlags))
    .pipe(jshint.reporter('default'));
});

// Building
gulp.task('build', function() {
  return gulp.src(jsFiles)
    .pipe(concat('artoo.concat.js'))
    .pipe(gulp.dest('./build'))
    .pipe(uglify())
    .pipe(header('/* artoo.js - <%= description %> - Version: <%= version %> - Author: <%= author.name %> - medialab SciencesPo */\n', pkg))
    .pipe(rename('artoo.min.js'))
    .pipe(gulp.dest('./build'));
});

function subBuild(name, files) {
  return function() {
    gulp.src(jsFiles.concat(files))
      .pipe(concat('artoo.' + name + '.js'))
      .pipe(gulp.dest('./build'));
  }
}

gulp.task('chrome', subBuild('chrome', chromeFiles));
gulp.task('phantomjs', subBuild('phantomjs', phantomjsFiles));

// Bookmarklets
gulp.task('bookmarklet.dev', function() {
  var opts = {
    random: true,
    loadingText: null,
    url: '//localhost:8000/build/artoo.concat.js',
    settings: {
      env: 'dev',
      reload: true
    }
  };

  return artoo.blank('bookmarklet.dev.min.js')
    .pipe(artoo(opts))
    .pipe(gulp.dest('./build'));
});

gulp.task('bookmarklet.prod', function() {
  return artoo.blank('bookmarklet.prod.min.js')
    .pipe(artoo())
    .pipe(gulp.dest('./build'));
});

// Watching
gulp.task('watch', ['build', 'chrome'], function() {
  gulp.watch(jsFiles, ['build', 'chrome', 'phantomjs']);
});

// Serving
gulp.task('serve', function() {
  return gulp.src('./')
    .pipe(webserver({
      directoryListing: true
    }));
});

gulp.task('serve.https', function() {
  return gulp.src('./')
    .pipe(webserver({
      directoryListing: true,
      https: true
    }));
});

// Macro-tasks
gulp.task('bookmarklets', ['bookmarklet.dev', 'bookmarklet.prod']);
gulp.task('work', ['watch', 'serve']);
gulp.task('https', ['watch', 'serve.https']);
gulp.task('default', ['lint', 'test', 'build', 'chrome', 'phantomjs']);
