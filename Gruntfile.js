module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      core: {
        files: 'core/**',
        tasks: ['copy'],
        options: {
          dot: true
        }
      }
    },

    copy: {
      copycore: {
        files: [
          {expand: true, src: ['core/**'], dot: true, dest: 'quill/'},
          {expand: true, src: ['core/**'], dot: true, dest: 'api/'},
          {expand: true, cwd: 'core/scripts', src: 'quill.js', dest:            'quill/app/assets/javascripts', filter: 'isFile'},
          {expand: true, cwd: 'core/scripts', src: 'quill.js', dest: 'questions-module/app/assets/javascripts', filter: 'isFile'}
        ]
      }
    },

    concat: {
      lib: {
        files: [{
          src: ['core/scripts/lib/*.js'],
          dest: 'core/scripts/quill.js'
        }]
      }
    },

    uglify: {
      lib: {
        files: [{
          src: ['core/scripts/quill.js'],
          dest: 'core/scripts/quill.min.js'
        }]
      }
    }

  });

  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('default', ['build','copy']);

  grunt.event.on('watch', function (action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
};
