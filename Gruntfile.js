module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['library/js/src/**/*.js']
    },
    concat: {
      debug: {
        src: ['library/js/src/**/*.js'],
        dest: 'library/js/tmp/debug.js'
      }
    },
    uglify: {
      options: {
        mangle: {
          except: ['jQuery']
        },
        preserveComments: 'none'
      },
      'library/js/scripts.min.js': ['library/js/tmp/debug.js']
    },
    watch: {      
      options: { livereload: true },
      scripts: {
        files: 'library/js/src/*.js',
        tasks: ['jshint', 'concat', 'uglify', 'clean']
      },
      css: {
        files: 'library/sass/*.scss',
        tasks: ['compass', 'cmq', 'cssmin', 'clean']
      },
      html: {
        files: '*.html',
        tasks: []
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
}