'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'html-directives.js',
        'tests.js'
      ]
    },

    uglify: {
      dist: {
        options: {
          sourceMap: true
        },
        files: {
          'html-directives.min.js': 'html-directives.js'
        }
      }
    },
  });

  // TODO finish tests
  grunt.registerTask('test', [
    'jshint',
    'karma'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'uglify'
  ]);

  grunt.registerTask('default', ['build']);
};
