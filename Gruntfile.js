
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngdocs');
 
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dist: 'dist',
    sources: 'src/**/*.js',
    tests: 'test/**/*.js',
    ngdocFiles: 'src/**/*.ngdoc',
    clean: {
      dist: ['<%= dist %>','_site']
    },
    jshint: {
      files: ['Gruntfile.js','<%= sources %>','<%= tests %>'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      unit: {},
      travis: {
        browsers: ['Firefox', 'PhantomJS']
      },
      watch: {
        singleRun: false
      }
    },
    uglify: {
      options: {
        banner: '/** Componitor v. <%= pkg.version %> */\n'
      },
      dist: {
        options: {
          mangle: false,
          compress: false,
          beautify: true,
          wrap: true
        },
        src: ['<%= sources %>'],
        dest: '<%= dist %>/componitor.js'
      },
      minify: {
        options: {
          sourceMap: true
        },
        src: ['<%= uglify.dist.dest %>'],
        dest: '<%= dist %>/componitor.min.js'
      }
    },
    ngdocs: {
      options: {
        dest: '<%= dist %>/docs',
        scripts: [
          'angular.js',
          '<%= uglify.dist.dest %>'
        ],
        title: 'componitor',
        startPage: 'api/componitor',
        titleLink: 'https://nitorcreations.github.io/componitor',
        html5Mode: false
      },
      api: {
        src: ['<%= sources %>', '<%= ngdocFiles %>'],
        title: 'API Documentation'
      }
    },
    watch: {
      ngdocs: {
        files: ['Gruntfile.js', '<%= sources %>', '<%= ngdocFiles %>'],
        tasks: ['after-test']
      }
    }
  });

  grunt.registerTask('before-test', ['enforce', 'jshint']);
  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('after-test', ['build']);
  grunt.registerTask('build', ['clean:dist', 'uglify', 'ngdocs:api']);
  grunt.registerTask('default', ['before-test','test','after-test']);

  grunt.registerTask('travis', ['before-test', 'karma:travis']);

  // Loaned from Angular-ui bootstrap
  grunt.registerTask('enforce', 'Install commit message enforce script if it doesn\'t exist', function() {
    if (!grunt.file.exists('.git/hooks/commit-msg')) {
      grunt.file.copy('misc/validate-commit-msg.js', '.git/hooks/commit-msg');
      require('fs').chmodSync('.git/hooks/commit-msg', '0755');
    }
  });

};
