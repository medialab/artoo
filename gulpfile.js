var gulp = require('gulp'),
    artoo = require('gulp-artoo'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    phantomMocha = require('gulp-mocha-phantomjs'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    webserver = require('gulp-webserver'),
    seq = require('run-sequence'),
    pkg = require('./package.json');

// Utilities
var jsFiles = [
  'src/artoo.js',
  'src/third_party/emmett.js',
  'src/third_party/jquery.simulate.js',
  'src/artoo.beep.js',
  'src/artoo.settings.js',
  'src/artoo.helpers.js',
  'src/artoo.parsers.js',
  'src/artoo.writers.js',
  'src/artoo.browser.js',
  'src/artoo.log.js',
  'src/artoo.dependencies.js',
  'src/artoo.countermeasures.js',
  'src/methods/artoo.methods.ajaxSniffer.js',
  'src/methods/artoo.methods.ajaxSpider.js',
  'src/methods/artoo.methods.autoExpand.js',
  'src/methods/artoo.methods.autoScroll.js',
  'src/methods/artoo.methods.cookies.js',
  'src/methods/artoo.methods.save.js',
  'src/methods/artoo.methods.scrape.js',
  'src/methods/artoo.methods.store.js',
  'src/methods/artoo.methods.ui.js',
  'src/artoo.init.js'
];

var nodeFiles = [
  'src/artoo.js',
  'src/node/artoo.node.shim.js',
  'src/third_party/emmett.js',
  'src/node/artoo.node.js',
  'src/artoo.helpers.js',
  'src/artoo.parsers.js',
  'src/artoo.writers.js',
  'src/node/artoo.node.helpers.js',
  'src/methods/artoo.methods.scrape.js',
  'src/node/artoo.node.require.js'
];

var chromeFiles = [
  'src/chrome/artoo.chrome.js'
];

var phantomFiles = [
  'src/phantom/artoo.phantom.js'
];

function lintFilter(i) {
  return !~i.indexOf('third_party');
}

// Testing
gulp.task('browser-test', function() {
  return gulp.src('./test/unit.html')
    .pipe(replace(
      /<!-- START ARTOO IMPORTS -->[\s\S]*<!-- END ARTOO IMPORTS -->/g,
      ['<!-- START ARTOO IMPORTS -->'].concat(
        jsFiles.slice(0, -1).map(function(path) {
          return '    <script src="../' + path + '"></script>';
        })
      ).concat('    <!-- END ARTOO IMPORTS -->').join('\n')
    ))
    .pipe(gulp.dest('./test'))
    .pipe(phantomMocha({reporter: 'spec'}));
});

gulp.task('node-test', ['build'], function() {
  return gulp.src('./test/endpoint.js')
    .pipe(mocha({reporter: 'spec'}));
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
function build(name, files) {
  return gulp.src(jsFiles.concat(name !== 'concat' ? files : []))
    .pipe(concat('artoo.' + name + '.js'))
    .pipe(gulp.dest('./build'));
}

gulp.task('build', function() {

  // Browser version
  build('concat')
    .pipe(uglify())
    .pipe(header('/* artoo.js - <%= description %> - Version: <%= version %> - Author: <%= author.name %> - medialab SciencesPo */\n', pkg))
    .pipe(rename('artoo.min.js'))
    .pipe(gulp.dest('./build'));

  // Chrome version
  build('chrome', chromeFiles);

  // Phantom version
  build('phantom', phantomFiles);

  // Node.js version
  gulp.src(nodeFiles)
    .pipe(concat('artoo.node.js'))
    .pipe(gulp.dest('./build'));
});

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
    .pipe(gulp.dest('./build/bookmarklets'));
});

gulp.task('bookmarklet.prod', function() {
  return artoo.blank('bookmarklet.prod.min.js')
    .pipe(artoo())
    .pipe(gulp.dest('./build/bookmarklets'));
});

gulp.task('bookmarklet.edge', function() {
  return artoo.blank('bookmarklet.edge.min.js')
    .pipe(artoo({
      version: 'edge',
      loadingText: 'artoo.js edge version is loading...'
    }))
    .pipe(gulp.dest('./build/bookmarklets'));
});

// Watching
gulp.task('watch', ['build'], function() {
  gulp.watch(jsFiles, ['build']);
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
gulp.task('bookmarklets', ['bookmarklet.dev', 'bookmarklet.prod', 'bookmarklet.edge']);
gulp.task('test', function(next) {
  seq('browser-test', 'node-test', next);
});
gulp.task('work', ['watch', 'serve']);
gulp.task('https', ['watch', 'serve.https']);
gulp.task('default', ['lint', 'test', 'build']);
