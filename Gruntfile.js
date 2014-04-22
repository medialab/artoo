module.exports = function(grunt) {
  
  var jsFiles = [
    'src/artoo.js',
    'src/artoo.helpers.js',
    'src/artoo.console.js',
    'src/artoo.injection.js',
    'src/methods/artoo.methods.save.js',
    'src/methods/artoo.methods.scrape.js',
    'src/methods/artoo.methods.store.js',
    'src/artoo.init.js'
  ];

  // Project configuration:
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    closureLint: {
      app: {
        closureLinterPath: '/usr/local/bin',
        command: 'gjslint',
        src: jsFiles,
        options: {
          stdout: true,
          strict: true,
          opt: '--disable 6,13'
        }
      }
    },
    jshint: {
      all: jsFiles,
      options: {
        '-W055': true,
        '-W040': true,
        '-W064': true
      }
    },
    uglify: {
      prod: {
        files: {
          'build/artoo.min.js': jsFiles
        },
        options: {
          banner: '/* artoo.js - <%= pkg.description %> - Version: <%= pkg.version %> -  médialab SciencesPo */\n'
        }
      },
      bookmarklets: {
        files: {
          'build/bookmarklet.dev.min.js': 'src/bookmarklets/bookmarklet.dev.js'
        },
        options: {
          banner: 'javascript: '
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
        tasks: ['concat']
      }
    }
  });

  // Loading modules
  grunt.loadNpmTasks('grunt-closure-linter');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default tasks
  grunt.registerTask(
    'default',
    [
      'closureLint',
      'jshint',
      'concat',
      'uglify:prod',
      'uglify:bookmarklets'
    ]
  );

  grunt.registerTask('work', ['watch:script'])
};