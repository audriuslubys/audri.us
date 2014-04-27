module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'dist/css/global.css': 'scss/main.scss'
        }
      }
    },

    watch: {
      css: {
        files: ['scss/**/*.scss', 'jade/**/*.jade', './data.json'],
        tasks: ['build']
      }
    },

    cssmin: {
      combine: {
        files: {
          'dist/css/global.min.css': ['dist/css/global.css']
        }
      }
    },

    jade: {
      debug: {
        options: {
          data: {
            debug: true,
            data: grunt.file.readJSON('data.json')
          }
        },
        files: {
          '.debug/debug.html': ['jade/**/*.jade']
        }
      },

      release: {
        options: {
          data: {
            debug: false,
            data: grunt.file.readJSON('data.json')
          },
          pretty: true
        },
        files: {
          'dist/index.html': ['jade/**/*.jade']
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            src: ['img/**', 'fonts/**'],
            dest: 'dist/'
          }
        ],
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['jade', 'sass', 'cssmin', 'copy']);

};