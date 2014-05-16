

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngdocs');
 
  grunt.initConfig({
    dist: 'dist',
    jshint: {
      files: ['Gruntfile.js','src/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        singleRun: true
      },
      watch: {
        singleRun: false
      }
    },
    concat: {
      dist: {
        src: ['src/**/*.js'],
        dest: '<%= dist %>/componitor.js'
      }
    },
    uglify: {
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: '<%= dist %>/componitor.min.js',
        sourceMap: true 
      }
    },
    ngdocs: {
      options: {
        dest: '<%= dist %>/docs',
        scripts: [
          'angular.js',
          '<%= concat.dist.dest %>'
        ],
        title: 'componitor',
        html5Mode: false
      },
      api: {
        files: ['src/**/*.js', 'src/**/*.ngdoc'],
        title: 'API Documentation'
      }
    }
  });

  grunt.registerTask('before-test', ['jshint']);
  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('after-test', ['build']);
  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('default', ['before-test','test','after-test']);
};
