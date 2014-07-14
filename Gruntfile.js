module.exports = function(grunt) {

  // Order IS important
  var jsFiles = [
    'src/artoo.js',
    'src/plugins/jquery.simulate.js',
    'src/plugins/jquery.classes.js',
    'src/plugins/jquery.path.js',
    'src/plugins/jquery.similar.js',
    'src/artoo.beep.js',
    'src/artoo.settings.js',
    'src/artoo.helpers.js',
    'src/artoo.hooks.js',
    'src/artoo.browser.js',
    'src/artoo.console.js',
    'src/artoo.dependencies.js',
    'src/artoo.countermeasures.js',
    'src/methods/artoo.methods.cache.js',
    'src/methods/artoo.methods.ajaxSpider.js',
    'src/methods/artoo.methods.autoExpand.js',
    'src/methods/artoo.methods.autoScroll.js',
    'src/methods/artoo.methods.db.js',
    'src/methods/artoo.methods.instructions.js',
    'src/methods/artoo.methods.navigate.js',
    'src/methods/artoo.methods.save.js',
    'src/methods/artoo.methods.scrape.js',
    'src/methods/artoo.methods.store.js',
    'src/methods/artoo.methods.state.js',
    'src/artoo.init.js'
  ];

  function lintFilter(i) {
    return !~i.indexOf('plugins');
  }

  // Project configuration:
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    closureLint: {
      app: {
        closureLinterPath: '/usr/local/bin',
        command: 'gjslint',
        src: jsFiles.filter(lintFilter),
        options: {
          stdout: true,
          strict: true,
          opt: '--disable 6,13,110'
        }
      }
    },
    jshint: {
      all: jsFiles.filter(lintFilter),
      options: {
        '-W055': true,
        '-W040': true,
        '-W064': true,
        '-W061': true,
        '-W103': true,
        '-W002': true
      }
    },
    uglify: {
      prod: {
        files: {
          'build/artoo.min.js': jsFiles
        },
        options: {
          banner: '/* artoo.js - <%= pkg.description %> - Version: <%= pkg.version %> - Author: <%= pkg.author.name %> - medialab SciencesPo */\n'
        }
      }
    },
    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: jsFiles,
        dest: 'build/artoo.concat.js'
      }
    },
    watch: {
      script: {
        files: jsFiles,
        tasks: ['concat', 'uglify:prod']
      }
    },
    sed: {
      imports: {
        recursive: true,
        path: 'test/',
        pattern: /<!-- START ARTOO IMPORTS -->[\s\S]*<!-- END ARTOO IMPORTS -->/g,
        replacement: ['<!-- START ARTOO IMPORTS -->'].concat(jsFiles.slice(0, -1).map(function(path) {
          return '  <script src="../' + path + '"></script>';
        }).concat('  <!-- END ARTOO IMPORTS -->')).join('\n')
      }
    },
    qunit: {
      all: {
        options: {
          urls: [
            './test/unit.html'
          ]
        }
      }
    },
    artoo: {
      dev: {
        options: {
          random: true,
          loadingText: null,
          url: '//localhost:8000/build/artoo.concat.js',
          settings: {
            debug: true,
            reload: true
          }
        },
        dest: './build/bookmarklet.dev.min.js'
      },
      prod: {
        options: {
          clipboard: false
        },
        dest: './build/bookmarklet.prod.min.js'
      }
    }
  });

  // Loading modules
  grunt.loadNpmTasks('grunt-closure-linter');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-artoo');
  grunt.loadNpmTasks('grunt-sed');

  // Default tasks
  grunt.registerTask(
    'default',
    [
      'closureLint',
      'jshint',
      'concat',
      'uglify',
      'sed',
      'qunit'
    ]
  );

  grunt.registerTask('bookmarklets', ['artoo']);
  grunt.registerTask('work', ['concat', 'watch:script']);
};
